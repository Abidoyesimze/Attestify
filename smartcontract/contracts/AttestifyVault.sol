// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./ISelfProtocol.sol";
import "./IMoola.sol";


contract AttestifyVault is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    /* ========== STATE VARIABLES ========== */

    // Token contracts
    IERC20 public immutable cUSD;
    IMToken public immutable mcUSD;  // Moola interest-bearing token
    
    // Protocol integrations
    ISelfProtocol public immutable selfProtocol;
    IMoolaLendingPool public immutable moolaPool;
    
    // Vault accounting (share-based system)
    uint256 public totalShares;
    mapping(address => uint256) public shares;
    
    // User data
    mapping(address => UserProfile) public users;
    mapping(address => StrategyType) public userStrategy;
    
    // Strategy configurations
    mapping(StrategyType => Strategy) public strategies;
    
    // Limits and config
    uint256 public constant MIN_DEPOSIT = 10e18;      // 10 cUSD
    uint256 public constant MAX_DEPOSIT = 10_000e18;  // 10,000 cUSD per tx
    uint256 public constant MAX_TVL = 100_000e18;     // 100,000 cUSD total (MVP)
    uint256 public constant RESERVE_RATIO = 10;       // Keep 10% liquid for instant withdrawals
    
    // Admin addresses
    address public aiAgent;
    address public treasury;
    
    // Statistics
    uint256 public totalDeposited;
    uint256 public totalWithdrawn;
    uint256 public lastRebalance;

    /* ========== STRUCTS & ENUMS ========== */

    struct UserProfile {
        bool isVerified;
        uint256 verifiedAt;
        uint256 totalDeposited;
        uint256 totalWithdrawn;
        uint256 lastActionTime;
    }

    enum StrategyType {
        CONSERVATIVE,  // 100% Moola (safest)
        BALANCED,      // 90% Moola, 10% reserve
        GROWTH         // 80% Moola, 20% for future opportunities
    }

    struct Strategy {
        string name;
        uint8 moolaAllocation;   // % to deploy to Moola
        uint8 reserveAllocation; // % to keep liquid
        uint16 targetAPY;        // Expected APY in basis points
        uint8 riskLevel;         // 1-10
        bool isActive;
    }

    /* ========== EVENTS ========== */

    event UserVerified(address indexed user, uint256 timestamp);
    event Deposited(address indexed user, uint256 assets, uint256 shares);
    event Withdrawn(address indexed user, uint256 assets, uint256 shares);
    event StrategyChanged(address indexed user, StrategyType oldStrategy, StrategyType newStrategy);
    event DeployedToMoola(uint256 amount, uint256 timestamp);
    event WithdrawnFromMoola(uint256 amount, uint256 timestamp);
    event Rebalanced(uint256 moolaBalance, uint256 reserveBalance, uint256 timestamp);

    /* ========== ERRORS ========== */

    error NotVerified();
    error InvalidAmount();
    error ExceedsMaxDeposit();
    error ExceedsMaxTVL();
    error InsufficientShares();
    error InsufficientLiquidity();
    error ZeroAddress();

    /* ========== CONSTRUCTOR ========== */

    constructor(
        address _cUSD,
        address _mcUSD,
        address _selfProtocol,
        address _moolaPool
    ) Ownable(msg.sender) {
        if (_cUSD == address(0) || _mcUSD == address(0) || 
            _selfProtocol == address(0) || _moolaPool == address(0)) {
            revert ZeroAddress();
        }
        
        cUSD = IERC20(_cUSD);
        mcUSD = IMToken(_mcUSD);
        selfProtocol = ISelfProtocol(_selfProtocol);
        moolaPool = IMoolaLendingPool(_moolaPool);
        treasury = msg.sender;
        
        _initializeStrategies();
        
        // Approve Moola to spend our cUSD
        cUSD.approve(_moolaPool, type(uint256).max);
    }

    function _initializeStrategies() internal {
        strategies[StrategyType.CONSERVATIVE] = Strategy({
            name: "Conservative",
            moolaAllocation: 100,
            reserveAllocation: 0,
            targetAPY: 350,      // 3.5% (conservative estimate)
            riskLevel: 1,
            isActive: true
        });

        strategies[StrategyType.BALANCED] = Strategy({
            name: "Balanced",
            moolaAllocation: 90,
            reserveAllocation: 10,
            targetAPY: 350,
            riskLevel: 3,
            isActive: true
        });

        strategies[StrategyType.GROWTH] = Strategy({
            name: "Growth",
            moolaAllocation: 80,
            reserveAllocation: 20,
            targetAPY: 350,      // Same APY, but more reserve for opportunities
            riskLevel: 5,
            isActive: true
        });
    }

    /* ========== MODIFIERS ========== */

    modifier onlyVerified() {
        if (!_isVerified(msg.sender)) revert NotVerified();
        _;
    }

    /* ========== IDENTITY VERIFICATION ========== */

    function verifyIdentity(bytes calldata proof) external {
        require(!users[msg.sender].isVerified, "Already verified");
        
        bool isValid = selfProtocol.verify(proof);
        require(isValid, "Invalid proof");
        
        users[msg.sender].isVerified = true;
        users[msg.sender].verifiedAt = block.timestamp;
        userStrategy[msg.sender] = StrategyType.CONSERVATIVE;
        
        emit UserVerified(msg.sender, block.timestamp);
    }

    function _isVerified(address user) internal view returns (bool) {
        if (users[user].isVerified) return true;
        return selfProtocol.isVerified(user);
    }

    function isVerified(address user) external view returns (bool) {
        return _isVerified(user);
    }

    /* ========== CORE FUNCTIONS: DEPOSIT ========== */

    /**
     * @notice Deposit cUSD and earn yield from Moola Market
     * @param assets Amount of cUSD to deposit
     * @return sharesIssued Amount of vault shares received
     */
    function deposit(uint256 assets) 
        external 
        nonReentrant 
        whenNotPaused 
        onlyVerified 
        returns (uint256 sharesIssued) 
    {
        if (assets < MIN_DEPOSIT) revert InvalidAmount();
        if (assets > MAX_DEPOSIT) revert ExceedsMaxDeposit();
        if (totalAssets() + assets > MAX_TVL) revert ExceedsMaxTVL();
        
        // Calculate shares to issue
        sharesIssued = _convertToShares(assets);
        
        // Update state
        shares[msg.sender] += sharesIssued;
        totalShares += sharesIssued;
        users[msg.sender].totalDeposited += assets;
        users[msg.sender].lastActionTime = block.timestamp;
        totalDeposited += assets;
        
        // Transfer cUSD from user
        cUSD.safeTransferFrom(msg.sender, address(this), assets);
        
        // Deploy to Moola immediately
        _deployToMoola(assets);
        
        emit Deposited(msg.sender, assets, sharesIssued);
    }

    /**
     * @notice Deploy cUSD to Moola Market to earn interest
     * @param amount Amount to deploy
     */
    function _deployToMoola(uint256 amount) internal {
        uint256 reserveAmount = (amount * RESERVE_RATIO) / 100;
        uint256 deployAmount = amount - reserveAmount;
        
        if (deployAmount > 0) {
            // Deposit to Moola (receives mcUSD in return)
            moolaPool.deposit(
                address(cUSD),
                deployAmount,
                address(this),
                0  // No referral code
            );
            
            emit DeployedToMoola(deployAmount, block.timestamp);
        }
    }

    /* ========== CORE FUNCTIONS: WITHDRAW ========== */

    /**
     * @notice Withdraw cUSD (redeems from Moola if needed)
     * @param assets Amount of cUSD to withdraw
     * @return sharesBurned Amount of shares burned
     */
    function withdraw(uint256 assets) 
        external 
        nonReentrant 
        returns (uint256 sharesBurned) 
    {
        sharesBurned = _convertToShares(assets);
        
        if (shares[msg.sender] < sharesBurned) revert InsufficientShares();
        
        // Update state BEFORE external calls
        shares[msg.sender] -= sharesBurned;
        totalShares -= sharesBurned;
        users[msg.sender].totalWithdrawn += assets;
        users[msg.sender].lastActionTime = block.timestamp;
        totalWithdrawn += assets;
        
        // Check if we need to withdraw from Moola
        uint256 reserveBalance = cUSD.balanceOf(address(this));
        
        if (reserveBalance < assets) {
            // Need to withdraw from Moola
            uint256 shortfall = assets - reserveBalance;
            _withdrawFromMoola(shortfall);
        }
        
        // Transfer cUSD to user
        cUSD.safeTransfer(msg.sender, assets);
        
        emit Withdrawn(msg.sender, assets, sharesBurned);
    }

    /**
     * @notice Withdraw from Moola Market
     * @param amount Amount needed
     */
    function _withdrawFromMoola(uint256 amount) internal {
        // Withdraw from Moola (burns mcUSD, returns cUSD)
        uint256 withdrawn = moolaPool.withdraw(
            address(cUSD),
            amount,
            address(this)
        );
        
        emit WithdrawnFromMoola(withdrawn, block.timestamp);
    }

    /* ========== VIEW FUNCTIONS ========== */

    /**
     * @notice Get total assets under management (reserve + Moola)
     * @return uint256 Total cUSD value
     */
    function totalAssets() public view returns (uint256) {
        uint256 reserveBalance = cUSD.balanceOf(address(this));
        uint256 moolaBalance = mcUSD.balanceOf(address(this));
        return reserveBalance + moolaBalance;
    }

    /**
     * @notice Get user's current balance in cUSD (including yield)
     */
    function balanceOf(address user) external view returns (uint256) {
        return _convertToAssets(shares[user]);
    }

    /**
     * @notice Get user's total earnings
     */
    function getEarnings(address user) external view returns (uint256) {
        uint256 currentBalance = _convertToAssets(shares[user]);
        uint256 deposited = users[user].totalDeposited;
        uint256 withdrawn = users[user].totalWithdrawn;
        
        if (currentBalance + withdrawn > deposited) {
            return (currentBalance + withdrawn) - deposited;
        }
        return 0;
    }

    /**
     * @notice Get vault statistics
     */
    function getVaultStats() 
        external 
        view 
        returns (
            uint256 _totalAssets,
            uint256 _totalShares,
            uint256 reserveBalance,
            uint256 moolaBalance,
            uint256 _totalDeposited,
            uint256 _totalWithdrawn
        ) 
    {
        return (
            totalAssets(),
            totalShares,
            cUSD.balanceOf(address(this)),
            mcUSD.balanceOf(address(this)),
            totalDeposited,
            totalWithdrawn
        );
    }

    /**
     * @notice Get current APY
     */
    function getCurrentAPY() external view returns (uint256) {
        // In production, could fetch real-time APY from Moola
        // For MVP, return target APY
        return 350; // 3.5%
    }

    /* ========== SHARE CONVERSION ========== */

    function _convertToShares(uint256 assets) internal view returns (uint256) {
        uint256 _totalAssets = totalAssets();
        if (totalShares == 0 || _totalAssets == 0) return assets;
        return (assets * totalShares) / _totalAssets;
    }

    function _convertToAssets(uint256 _shares) internal view returns (uint256) {
        if (totalShares == 0) return 0;
        return (_shares * totalAssets()) / totalShares;
    }

    /* ========== STRATEGY MANAGEMENT ========== */

    function changeStrategy(StrategyType newStrategy) external onlyVerified {
        require(strategies[newStrategy].isActive, "Invalid strategy");
        
        StrategyType oldStrategy = userStrategy[msg.sender];
        userStrategy[msg.sender] = newStrategy;
        
        emit StrategyChanged(msg.sender, oldStrategy, newStrategy);
    }

    /* ========== ADMIN FUNCTIONS ========== */

    /**
     * @notice Rebalance vault (maintain target reserve ratio)
     * @dev Can be called by owner or AI agent
     */
    function rebalance() external {
        require(msg.sender == owner() || msg.sender == aiAgent, "Unauthorized");
        
        uint256 _totalAssets = totalAssets();
        uint256 targetReserve = (_totalAssets * RESERVE_RATIO) / 100;
        uint256 currentReserve = cUSD.balanceOf(address(this));
        
        if (currentReserve < targetReserve) {
            // Withdraw from Moola to meet reserve target
            uint256 needed = targetReserve - currentReserve;
            _withdrawFromMoola(needed);
        } else if (currentReserve > targetReserve * 2) {
            // Too much reserve, deploy excess to Moola
            uint256 excess = currentReserve - targetReserve;
            _deployToMoola(excess);
        }
        
        lastRebalance = block.timestamp;
        emit Rebalanced(mcUSD.balanceOf(address(this)), cUSD.balanceOf(address(this)), block.timestamp);
    }

    function setAIAgent(address _aiAgent) external onlyOwner {
        if (_aiAgent == address(0)) revert ZeroAddress();
        aiAgent = _aiAgent;
    }

    function setTreasury(address _treasury) external onlyOwner {
        if (_treasury == address(0)) revert ZeroAddress();
        treasury = _treasury;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Emergency withdraw (only if paused)
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        require(paused(), "Not paused");
        IERC20(token).safeTransfer(owner(), amount);
    }
}
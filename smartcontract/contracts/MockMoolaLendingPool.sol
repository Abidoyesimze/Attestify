// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockMoolaLendingPool
 * @notice Mock implementation of Moola Lending Pool for testing
 */
contract MockMoolaLendingPool is Ownable {
    mapping(address => address) public mTokens; // underlying -> mToken mapping
    mapping(address => uint256) public deposits; // user -> amount deposited
    
    event Deposit(address indexed asset, uint256 amount, address indexed onBehalfOf, uint16 referralCode);
    event Withdraw(address indexed asset, uint256 amount, address indexed to);

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Set mToken for an underlying asset
     * @param underlying The underlying token address
     * @param mToken The mToken address
     */
    function setMToken(address underlying, address mToken) external onlyOwner {
        mTokens[underlying] = mToken;
    }

    /**
     * @notice Mock deposit function
     * @param asset The asset to deposit
     * @param amount The amount to deposit
     * @param onBehalfOf The user to deposit for
     * @param referralCode The referral code (unused in mock)
     */
    function deposit(
        address asset,
        uint256 amount,
        address onBehalfOf,
        uint16 referralCode
    ) external {
        require(mTokens[asset] != address(0), "MToken not set");
        
        // Transfer underlying token from caller
        IERC20(asset).transferFrom(msg.sender, address(this), amount);
        
        // Mint mToken to caller (simplified - in real Moola, this would be more complex)
        IERC20 mToken = IERC20(mTokens[asset]);
        // Note: In a real test, we'd need to implement minting on the mToken
        
        deposits[onBehalfOf] += amount;
        
        emit Deposit(asset, amount, onBehalfOf, referralCode);
    }

    /**
     * @notice Mock withdraw function
     * @param asset The asset to withdraw
     * @param amount The amount to withdraw
     * @param to The recipient address
     * @return withdrawn The actual amount withdrawn
     */
    function withdraw(
        address asset,
        uint256 amount,
        address to
    ) external returns (uint256 withdrawn) {
        require(mTokens[asset] != address(0), "MToken not set");
        
        // In real Moola, this would burn mTokens and transfer underlying
        // For mock, we just transfer the underlying token
        IERC20(asset).transfer(to, amount);
        
        withdrawn = amount;
        
        emit Withdraw(asset, amount, to);
    }

    /**
     * @notice Get user's deposit amount
     * @param user The user address
     * @return amount The deposit amount
     */
    function getUserDeposit(address user) external view returns (uint256 amount) {
        return deposits[user];
    }
}

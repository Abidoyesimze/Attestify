// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IMoola
 * @notice Interface for Moola Market lending protocol
 * @dev Moola is a lending/borrowing protocol on Celo (Aave v2 fork)
 * 
 * How it works:
 * 1. Deposit cUSD → Receive mcUSD (interest-bearing token)
 * 2. mcUSD automatically accrues interest
 * 3. Redeem mcUSD → Get back cUSD + interest
 * 
 * Moola Docs: https://docs.moola.market
 * Alfajores LendingPool: 0x0886f74eEEc443fBb6907fB5528B57C28E813129
 */

/**
 * @notice Main Moola LendingPool interface
 */
interface IMoolaLendingPool {
    /**
     * @notice Deposit assets to earn interest
     * @param asset Address of the asset (e.g., cUSD)
     * @param amount Amount to deposit
     * @param onBehalfOf Address that will receive mTokens (usually msg.sender)
     * @param referralCode Referral code (use 0)
     */
    function deposit(
        address asset,
        uint256 amount,
        address onBehalfOf,
        uint16 referralCode
    ) external;
    
    /**
     * @notice Withdraw assets
     * @param asset Address of the asset
     * @param amount Amount to withdraw (use type(uint256).max for all)
     * @param to Address to receive withdrawn assets
     * @return uint256 Actual amount withdrawn
     */
    function withdraw(
        address asset,
        uint256 amount,
        address to
    ) external returns (uint256);
    
    /**
     * @notice Get user account data
     * @param user Address to check
     * @return totalCollateralETH Total collateral in ETH
     * @return totalDebtETH Total debt in ETH
     * @return availableBorrowsETH Available to borrow in ETH
     * @return currentLiquidationThreshold Liquidation threshold
     * @return ltv Loan to value
     * @return healthFactor Health factor
     */
    function getUserAccountData(address user)
        external
        view
        returns (
            uint256 totalCollateralETH,
            uint256 totalDebtETH,
            uint256 availableBorrowsETH,
            uint256 currentLiquidationThreshold,
            uint256 ltv,
            uint256 healthFactor
        );
}

/**
 * @notice Moola mToken interface (e.g., mcUSD)
 * @dev mTokens are ERC20 tokens that represent deposits + accrued interest
 */
interface IMToken {
    /**
     * @notice Balance of mTokens (represents deposited amount + interest)
     */
    function balanceOf(address account) external view returns (uint256);
    
    /**
     * @notice Get scaled balance (internal accounting)
     */
    function scaledBalanceOf(address user) external view returns (uint256);
    
    /**
     * @notice Total supply of mTokens
     */
    function totalSupply() external view returns (uint256);
    
    /**
     * @notice Approve spending
     */
    function approve(address spender, uint256 amount) external returns (bool);
    
    /**
     * @notice Transfer mTokens
     */
    function transfer(address to, uint256 amount) external returns (bool);
    
    /**
     * @notice Get underlying asset address
     */
    function UNDERLYING_ASSET_ADDRESS() external view returns (address);
}

/**
 * @notice Contract addresses on Celo Alfajores Testnet
 */
library MoolaAddresses {
    // Moola LendingPool on Alfajores
    address public constant LENDING_POOL_ALFAJORES = 0x0886f74eEEc443fBb6907fB5528B57C28E813129;
    
    // mToken addresses (interest-bearing tokens)
    address public constant MCUSD_ALFAJORES = 0x71DB38719f9113A36e14F409bAD4F07B58b4730b;
    address public constant MCEUR_ALFAJORES = 0x32974C7335e649932b5766c5aE15595aFC269160;
    address public constant MCELO_ALFAJORES = 0x86f61EB83e10e914fc6F321F5dD3c2dD4860a003;
    
    // Underlying assets
    address public constant CUSD_ALFAJORES = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;
    address public constant CEUR_ALFAJORES = 0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F;
    address public constant CELO_ALFAJORES = 0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9;
}

/**
 * @notice Helper library for Moola calculations
 */
library MoolaHelpers {
    /**
     * @notice Calculate expected yield
     * @param principal Amount deposited
     * @param apy Annual percentage yield (in basis points)
     * @param daysInvested Number of days invested
     * @return uint256 Expected interest earned
     */
    function calculateYield(
        uint256 principal,
        uint256 apy,
        uint256 daysInvested
    ) internal pure returns (uint256) {
        // yield = principal * (apy / 10000) * (days / 365)
        return (principal * apy * daysInvested) / (10000 * 365);
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MockToken
 * @notice Mock ERC20 token for testing (cUSD on testnet)
 */
contract MockToken is ERC20 {
    constructor() ERC20("Celo Dollar", "cUSD") {
        // Mint 1 million cUSD for testing
        _mint(msg.sender, 1_000_000 * 10**18);
    }

    /**
     * @notice Mint tokens for testing
     * @param to Recipient address
     * @param amount Amount to mint
     */
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    /**
     * @notice Decimals (same as real cUSD)
     */
    function decimals() public pure override returns (uint8) {
        return 18;
    }
}
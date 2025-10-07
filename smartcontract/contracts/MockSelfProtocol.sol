// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockSelfProtocol
 * @notice Mock implementation of Self Protocol for testing
 */
contract MockSelfProtocol is Ownable {
    mapping(address => bool) public verifiedUsers;
    mapping(bytes => bool) public validProofs;

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Mock verification function
     * @param proof The proof to verify
     * @return isValid Whether the proof is valid
     */
    function verify(bytes calldata proof) external view returns (bool isValid) {
        return validProofs[proof];
    }

    /**
     * @notice Check if user is verified
     * @param user The user address to check
     * @return isVerified Whether the user is verified
     */
    function isVerified(address user) external view returns (bool isVerified) {
        return verifiedUsers[user];
    }

    /**
     * @notice Set a proof as valid (for testing)
     * @param proof The proof to mark as valid
     */
    function setValidProof(bytes calldata proof) external onlyOwner {
        validProofs[proof] = true;
    }

    /**
     * @notice Manually verify a user (for testing)
     * @param user The user to verify
     */
    function verifyUser(address user) external onlyOwner {
        verifiedUsers[user] = true;
    }

    /**
     * @notice Verify user with proof (simulates real verification)
     * @param user The user to verify
     * @param proof The proof to use
     */
    function verifyUserWithProof(address user, bytes calldata proof) external {
        require(validProofs[proof], "Invalid proof");
        verifiedUsers[user] = true;
    }
}

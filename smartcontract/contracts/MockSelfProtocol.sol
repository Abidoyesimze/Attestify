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
    bool public acceptAllProofs = false; // For easier testing

    event ProofVerified(address indexed user, bytes proof);
    event UserVerified(address indexed user);

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Mock verification function
     * @param proof The proof to verify
     * @return isValid Whether the proof is valid
     */
    function verify(bytes calldata proof) external view returns (bool isValid) {
        // For testing: accept all non-empty proofs if acceptAllProofs is true
        if (acceptAllProofs && proof.length > 0) {
            return true;
        }
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
        emit ProofVerified(address(0), proof);
    }

    /**
     * @notice Manually verify a user (for testing)
     * @param user The user to verify
     */
    function verifyUser(address user) external onlyOwner {
        verifiedUsers[user] = true;
        emit UserVerified(user);
    }

    /**
     * @notice Verify user with proof (simulates real verification)
     * @param user The user to verify
     * @param proof The proof to use
     */
    function verifyUserWithProof(address user, bytes calldata proof) external {
        require(acceptAllProofs || validProofs[proof], "Invalid proof");
        verifiedUsers[user] = true;
        emit UserVerified(user);
    }

    /**
     * @notice Toggle acceptance of all proofs (for easier testing)
     * @param _accept Whether to accept all proofs
     */
    function setAcceptAllProofs(bool _accept) external onlyOwner {
        acceptAllProofs = _accept;
    }

    /**
     * @notice Get verification timestamp (mock - returns current timestamp if verified)
     * @param user The address to check
     * @return uint256 Timestamp of verification (0 if not verified)
     */
    function getVerificationTime(address user) external view returns (uint256) {
        return verifiedUsers[user] ? block.timestamp : 0;
    }
}

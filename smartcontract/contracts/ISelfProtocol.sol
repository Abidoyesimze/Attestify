// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ISelfProtocol
 * @notice Interface for Self Protocol Identity Hub
 * @dev Deployed at 0x16ECBA51e18a4a7e61fdC417f0d47AFEeDfbed74 on Celo Alfajores
 */
interface ISelfProtocol {
    /**
     * @notice Verify a user's identity proof
     * @param proof The zero-knowledge proof data
     * @return bool True if verification successful
     */
    function verify(bytes calldata proof) external view returns (bool);
    
    /**
     * @notice Check if an address is verified
     * @param user The address to check
     * @return bool True if user is verified
     */
    function isVerified(address user) external view returns (bool);
    
    /**
     * @notice Get verification timestamp
     * @param user The address to check
     * @return uint256 Timestamp of verification (0 if not verified)
     */
    function getVerificationTime(address user) external view returns (uint256);
}

/**
 * @notice Self Protocol verification data structure
 */
struct IdentityProof {
    address user;           // User's wallet address
    bytes32 proofHash;      // Hash of the ZK proof
    uint256 timestamp;      // When verified
    bool isAdult;           // Age 18+ verified
    bool notSanctioned;     // Not on OFAC list
    string country;         // Country code (optional)
}
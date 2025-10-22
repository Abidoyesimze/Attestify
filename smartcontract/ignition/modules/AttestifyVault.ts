import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const UpdatedAttestifyVaultModule = buildModule("UpdatedAttestifyVaultModule", (m) => {
  // Contract addresses on Celo Sepolia
  const CUSD_ADDRESS = "0xdE9e4C3ce781b4bA68120d6261cbad65ce0aB00b";
  const ACUSD_ADDRESS = "0xBba98352628B0B0c4b40583F593fFCb630935a45";
  const AAVE_POOL = "0x3E59A31363E2ad014dcbc521c4a0d5757d9f3402";

  // Deploy AttestifyVault with simplified constructor
  const vault = m.contract("AttestifyVault", [
    CUSD_ADDRESS,
    ACUSD_ADDRESS,
    AAVE_POOL,
  ]);

  return { vault };
});

export default UpdatedAttestifyVaultModule;

import hre from "hardhat";

async function main() {
  console.log("🚀 Deploying AttestifyVault to Celo Sepolia...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log(
    "Account balance:",
    (await deployer.provider.getBalance(deployer.address)).toString()
  );

  // 🧩 Contract addresses on Celo Sepolia
  const SELF_PROTOCOL = "0x16ECBA51e18a4a7e61fdC417f0d47AFEeDfbed74";
  const CUSD_ADDRESS = "0xdE9e4C3ce781b4bA68120d6261cbad65ce0aB00b";
  const ACUSD_ADDRESS = "0xBba98352628B0B0c4b40583F593fFCb630935a45";
  const AAVE_POOL = "0x3E59A31363E2ad014dcbc521c4a0d5757d9f3402";

  console.log("\n📝 Using Celo Sepolia (or Fork) Contracts:");
  console.log("  Self Protocol:", SELF_PROTOCOL);
  console.log("  cUSD:", CUSD_ADDRESS);
  console.log("  acUSD (Aave):", ACUSD_ADDRESS);
  console.log("  Aave Pool:", AAVE_POOL);

  // 🚀 Deploy AttestifyVault
  console.log("\n📝 Deploying AttestifyVault...");
  const AttestifyVault = await hre.ethers.getContractFactory("AttestifyVault");
  const vault = await AttestifyVault.deploy(
    CUSD_ADDRESS,
    ACUSD_ADDRESS,
    SELF_PROTOCOL,
    AAVE_POOL
  );

  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();

  console.log("\n✅ AttestifyVault deployed to:", vaultAddress);

  // 💾 Deployment Summary
  const deploymentSummary = {
    vault: vaultAddress,
    cUSD: CUSD_ADDRESS,
    acUSD: ACUSD_ADDRESS,
    aavePool: AAVE_POOL,
    selfProtocol: SELF_PROTOCOL,
  };

  console.log("\n============================================================");
  console.log("💾 Deployment summary:");
  console.log(JSON.stringify(deploymentSummary, null, 2));
  console.log("============================================================\n");

  // 🔍 Verify on Celoscan if API key is available
  if (process.env.CELOSCAN_API_KEY) {
    console.log("\n⏳ Waiting for block confirmations...");
    await vault.deploymentTransaction().wait(5);

    console.log("🔍 Verifying contract on Celoscan...");
    try {
      await hre.run("verify:verify", {
        address: vaultAddress,
        constructorArguments: [
          CUSD_ADDRESS,
          ACUSD_ADDRESS,
          SELF_PROTOCOL,
          AAVE_POOL,
        ],
      });
      console.log("✅ Contract verified!");
    } catch (error) {
      console.log("⚠️ Verification failed:", error.message);
    }
  }

  console.log("\n🎉 Deployment complete!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

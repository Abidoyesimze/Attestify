import hre from "hardhat";

async function main() {
  console.log("🚀 Deploying Attestify to Celo Alfajores...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log(
    "Account balance:",
    (await deployer.provider.getBalance(deployer.address)).toString()
  );

  // Contract addresses on Celo Alfajores Testnet
  const SELF_PROTOCOL = "0x16ECBA51e18a4a7e61fdC417f0d47AFEeDfbed74";
  const CUSD_ADDRESS = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";
  const MCUSD_ADDRESS = "0x71DB38719f9113A36e14F409bAD4F07B58b4730b";
  const MOOLA_POOL = "0x0886f74eEEc443fBb6907fB5528B57C28E813129";

  console.log("\n📝 Using Celo Alfajores contracts:");
  console.log("  Self Protocol:", SELF_PROTOCOL);
  console.log("  cUSD:", CUSD_ADDRESS);
  console.log("  mcUSD (Moola):", MCUSD_ADDRESS);
  console.log("  Moola LendingPool:", MOOLA_POOL);

  // Deploy AttestifyVault
  console.log("\n📝 Deploying AttestifyVault...");
  const AttestifyVault = await hre.ethers.getContractFactory("AttestifyVault");
  const vault = await AttestifyVault.deploy(
    CUSD_ADDRESS,
    MCUSD_ADDRESS,
    SELF_PROTOCOL,
    MOOLA_POOL,
    "attestify-vault-scope" // scopeSeed parameter
  );

  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();

  console.log("\n✅ AttestifyVault deployed to:", vaultAddress);

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      AttestifyVault: vaultAddress,
      cUSD: CUSD_ADDRESS,
      mcUSD: MCUSD_ADDRESS,
      MoolaLendingPool: MOOLA_POOL,
      SelfProtocol: SELF_PROTOCOL,
    },
  };

  console.log("\n📄 Deployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  if (process.env.CELOSCAN_API_KEY) {
    console.log("\n⏳ Waiting for block confirmations...");
    await vault.deploymentTransaction().wait(5);

    console.log("🔍 Verifying contract on Celoscan...");
    try {
      await hre.run("verify:verify", {
        address: vaultAddress,
        constructorArguments: [
          CUSD_ADDRESS,
          MCUSD_ADDRESS,
          SELF_PROTOCOL,
          MOOLA_POOL,
          "attestify-vault-scope",
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

import hre from "hardhat";

async function main() {
  const VAULT_ADDRESS = "0xb03397B98Cd4032042C81b545E6D1c7cCadBC110";
  
  console.log("🔍 Checking contract state...");
  console.log("Contract address:", VAULT_ADDRESS);
  
  // Get contract instance
  const vault = await hre.viem.getContractAt("AttestifyVault", VAULT_ADDRESS);
  
  try {
    // Check configId
    const configId = await vault.read.configId();
    console.log("Current configId:", configId);
    
    if (configId === "0x0000000000000000000000000000000000000000000000000000000000000000") {
      console.log("❌ ConfigId is NOT set!");
      
      // Set the configId
      console.log("📝 Setting configId...");
      const CONFIG_ID = "0x986751c577aa5cfaef6f49fa2a46fa273b04e1bf78250966b8037dccf8afd399";
      
      const txHash = await vault.write.setConfigId([CONFIG_ID]);
      console.log("Transaction hash:", txHash);
      
      // Wait for confirmation
      const publicClient = hre.viem.getPublicClient();
      await publicClient.waitForTransactionReceipt({ hash: txHash });
      
      console.log("✅ ConfigId set successfully!");
      
      // Verify it was set
      const newConfigId = await vault.read.configId();
      console.log("New configId:", newConfigId);
      
    } else {
      console.log("✅ ConfigId is already set!");
    }
    
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

main().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exit(1);
});

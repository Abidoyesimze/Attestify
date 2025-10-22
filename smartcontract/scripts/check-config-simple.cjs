const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
  const VAULT_ADDRESS = "0xb03397B98Cd4032042C81b545E6D1c7cCadBC110";
  const CONFIG_ID = "0x986751c577aa5cfaef6f49fa2a46fa273b04e1bf78250966b8037dccf8afd399";
  
  console.log("🔍 Checking contract state...");
  console.log("Contract address:", VAULT_ADDRESS);
  
  // Connect to Celo Sepolia
  const provider = new ethers.JsonRpcProvider("https://forno.celo-sepolia.celo-testnet.org");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  console.log("Using wallet:", wallet.address);
  
  // Contract ABI for the functions we need
  const contractABI = [
    "function configId() external view returns (bytes32)",
    "function setConfigId(bytes32 _configId) external",
    "function owner() external view returns (address)"
  ];
  
  const vault = new ethers.Contract(VAULT_ADDRESS, contractABI, wallet);
  
  try {
    // Check owner
    const owner = await vault.owner();
    console.log("Contract owner:", owner);
    console.log("Our wallet:", wallet.address);
    
    if (owner.toLowerCase() !== wallet.address.toLowerCase()) {
      console.log("❌ We are not the contract owner!");
      return;
    }
    
    // Check configId
    const configId = await vault.configId();
    console.log("Current configId:", configId);
    
    if (configId === "0x0000000000000000000000000000000000000000000000000000000000000000") {
      console.log("❌ ConfigId is NOT set!");
      
      // Set the configId
      console.log("📝 Setting configId...");
      const tx = await vault.setConfigId(CONFIG_ID);
      console.log("Transaction hash:", tx.hash);
      
      await tx.wait();
      console.log("✅ ConfigId set successfully!");
      
      // Verify it was set
      const newConfigId = await vault.configId();
      console.log("New configId:", newConfigId);
      
    } else {
      console.log("✅ ConfigId is already set!");
    }
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

main().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exit(1);
});

import { ethers } from 'ethers';

// Contract addresses
const VAULT_ADDRESS = '0x02929f7b33e39acA574BE268552181370f728980';
const CUSD_ADDRESS = '0xdE9e4C3ce781b4bA68120d6261cbad65ce0aB00b'; // Real Celo Sepolia cUSD

// Contract ABIs
const VAULT_ABI = [
  "function deposit(uint256 assets) external returns (uint256)",
  "function withdraw(uint256 assets) external returns (uint256)",
  "function isVerified(address user) external view returns (bool)",
  "function verifySelfProof(bytes memory proof, bytes memory data) external",
  "function balanceOf(address user) external view returns (uint256)",
  "function MIN_DEPOSIT() external view returns (uint256)",
  "function paused() external view returns (bool)",
  "function totalAssets() external view returns (uint256)"
];

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function transfer(address to, uint256 amount) external returns (bool)"
];

// Celo Sepolia RPC URL
const RPC_URL = 'https://forno.celo-sepolia.celo-testnet.org';

export class EthersDirectIntegration {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.JsonRpcSigner | null = null;
  private vaultContract: ethers.Contract;
  private cusdContract: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(RPC_URL);
    this.vaultContract = new ethers.Contract(VAULT_ADDRESS, VAULT_ABI, this.provider);
    this.cusdContract = new ethers.Contract(CUSD_ADDRESS, ERC20_ABI, this.provider);
  }

  // Connect wallet
  async connectWallet() {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask not found');
    }

    await window.ethereum.request({ method: 'eth_requestAccounts' });
    this.signer = await this.provider.getSigner();
    
    // Update contracts with signer
    this.vaultContract = this.vaultContract.connect(this.signer);
    this.cusdContract = this.cusdContract.connect(this.signer);

    return this.signer.getAddress();
  }

  // Get account info
  async getAccountInfo() {
    if (!this.signer) throw new Error('Wallet not connected');

    const address = await this.signer.getAddress();
    const ethBalance = await this.provider.getBalance(address);
    const cusdBalance = await this.cusdContract.balanceOf(address);
    const isVerified = await this.vaultContract.isVerified(address);
    const minDeposit = await this.vaultContract.MIN_DEPOSIT();
    const isPaused = await this.vaultContract.paused();

    return {
      address,
      ethBalance: ethers.formatEther(ethBalance),
      cusdBalance: ethers.formatEther(cusdBalance),
      isVerified,
      minDeposit: ethers.formatEther(minDeposit),
      isPaused
    };
  }

  // Verify user
  async verifyUser() {
    if (!this.signer) throw new Error('Wallet not connected');

    try {
      const tx = await this.vaultContract.verifySelfProof('0x', '0x', {
        gasLimit: 200000
      });
      console.log('Verification tx:', tx.hash);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Verification failed:', error);
      throw error;
    }
  }

  // Check allowance
  async checkAllowance() {
    if (!this.signer) throw new Error('Wallet not connected');

    const address = await this.signer.getAddress();
    const allowance = await this.cusdContract.allowance(address, VAULT_ADDRESS);
    return ethers.formatEther(allowance);
  }

  // Approve cUSD
  async approveCUSD(amount: string) {
    if (!this.signer) throw new Error('Wallet not connected');

    try {
      const amountWei = ethers.parseEther(amount);
      const tx = await this.cusdContract.approve(VAULT_ADDRESS, amountWei, {
        gasLimit: 100000
      });
      console.log('Approval tx:', tx.hash);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Approval failed:', error);
      throw error;
    }
  }

  // Deposit function
  async deposit(amount: string) {
    if (!this.signer) throw new Error('Wallet not connected');

    try {
      const amountWei = ethers.parseEther(amount);
      
      // Check if approval is needed
      const address = await this.signer.getAddress();
      const allowance = await this.cusdContract.allowance(address, VAULT_ADDRESS);
      
      if (allowance < amountWei) {
        console.log('Approval needed...');
        await this.approveCUSD(amount);
      }

      console.log('Attempting deposit with ethers.js directly...');
      console.log('Amount:', amount, 'cUSD');
      console.log('Amount (wei):', amountWei.toString());

      // Try deposit with explicit gas settings
      const tx = await this.vaultContract.deposit(amountWei, {
        gasLimit: 500000, // Increased gas limit
        gasPrice: ethers.parseUnits('20', 'gwei') // Explicit gas price
      });

      console.log('Deposit tx:', tx.hash);
      console.log('Gas limit used:', tx.gasLimit?.toString());
      console.log('Gas price:', tx.gasPrice?.toString());

      const receipt = await tx.wait();
      console.log('✅ Deposit successful!');
      console.log('Gas used:', receipt?.gasUsed.toString());
      console.log('Transaction receipt:', receipt);

      return {
        success: true,
        txHash: tx.hash,
        gasUsed: receipt?.gasUsed.toString()
      };

    } catch (error: any) {
      console.error('❌ Deposit failed:', error);
      
      // Parse error details
      let errorMessage = 'Transaction failed';
      if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
        errorMessage = 'Gas estimation failed - try increasing gas limit';
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        errorMessage = 'Insufficient funds for gas or deposit';
      } else if (error.message.includes('execution reverted')) {
        errorMessage = 'Contract execution reverted';
      } else if (error.message.includes('user rejected')) {
        errorMessage = 'Transaction rejected by user';
      }

      return {
        success: false,
        error: errorMessage,
        details: error.message
      };
    }
  }

  // Get vault balance
  async getVaultBalance() {
    if (!this.signer) throw new Error('Wallet not connected');

    const address = await this.signer.getAddress();
    const balance = await this.vaultContract.balanceOf(address);
    return ethers.formatEther(balance);
  }
}

// Global instance
export const ethersIntegration = new EthersDirectIntegration();

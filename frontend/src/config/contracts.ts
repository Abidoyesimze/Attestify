// Contract addresses for AttestifyVault on Celo networks
export const CONTRACT_ADDRESSES = {
  // Celo Sepolia Testnet
  celoSepolia: {
    vault: process.env.NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS || '', // Will be set after deployment
    cUSD: process.env.NEXT_PUBLIC_CUSD_CONTRACT_ADDRESS || '0x765DE816845861e75A25fCA122bb6898B8B1282a',
    acUSD: process.env.NEXT_PUBLIC_ACUSD_CONTRACT_ADDRESS || '0xBba98352628B0B0c4b40583F593fFCb630935a45',
    aavePool: process.env.NEXT_PUBLIC_AAVE_POOL_ADDRESS || '0x3E59A31363E2ad014dcbc521c4a0d5757d9f3402',
    selfProtocol: process.env.NEXT_PUBLIC_SELF_PROTOCOL_ADDRESS || '0x16ECBA51e18a4a7e61fdC417f0d47AFEeDfbed74',
  },
  // Celo Mainnet (for future use)
  celoMainnet: {
    vault: process.env.NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS_MAINNET || '', // Will be set after mainnet deployment
    cUSD: process.env.NEXT_PUBLIC_CUSD_CONTRACT_ADDRESS_MAINNET || '0x765DE816845861e75A25fCA122bb6898B8B1282a',
    acUSD: process.env.NEXT_PUBLIC_ACUSD_CONTRACT_ADDRESS_MAINNET || '0xBba98352628B0B0c4b40583F593fFCb630935a45',
    aavePool: process.env.NEXT_PUBLIC_AAVE_POOL_ADDRESS_MAINNET || '0x3E59A31363E2ad014dcbc521c4a0d5757d9f3402',
    selfProtocol: process.env.NEXT_PUBLIC_SELF_PROTOCOL_ADDRESS_MAINNET || '0x16ECBA51e18a4a7e61fdC417f0d47AFEeDfbed74',
  },
};

// App configuration
export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'Attestify',
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'AI-powered investment vault with privacy-preserving identity verification',
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'a69043ecf4dca5c34a5e70fdfeac4558',
  networks: {
    celoSepolia: {
      chainId: 11142220,
      name: 'Celo Sepolia',
      rpcUrl: 'https://forno.celo-sepolia.celo-testnet.org',
      explorerUrl: 'https://celo-sepolia.blockscout.com',
      nativeCurrency: {
        name: 'Sepolia Celo',
        symbol: 'S-CELO',
        decimals: 18,
      },
    },
    celoMainnet: {
      chainId: 42220,
      name: 'Celo',
      rpcUrl: 'https://forno.celo.org',
      explorerUrl: 'https://celoscan.io',
      nativeCurrency: {
        name: 'Celo',
        symbol: 'CELO',
        decimals: 18,
      },
    },
  },
};

// Vault configuration
export const VAULT_CONFIG = {
  minDeposit: '10', // 10 cUSD
  maxDeposit: '10000', // 10,000 cUSD per transaction
  maxTVL: '100000', // 100,000 cUSD total (MVP)
  reserveRatio: 10, // 10% kept liquid for withdrawals
  targetAPY: 350, // 3.5% (350 basis points)
};

// Strategy types
export const STRATEGY_TYPES = {
  CONSERVATIVE: {
    id: 0,
    name: 'Conservative',
    description: '100% Aave allocation - Safest option',
    aaveAllocation: 100,
    reserveAllocation: 0,
    targetAPY: 350,
    riskLevel: 1,
  },
  BALANCED: {
    id: 1,
    name: 'Balanced',
    description: '90% Aave, 10% reserve - Balanced approach',
    aaveAllocation: 90,
    reserveAllocation: 10,
    targetAPY: 350,
    riskLevel: 3,
  },
  GROWTH: {
    id: 2,
    name: 'Growth',
    description: '80% Aave, 20% reserve - Growth focused',
    aaveAllocation: 80,
    reserveAllocation: 20,
    targetAPY: 350,
    riskLevel: 5,
  },
} as const;

export type StrategyType = keyof typeof STRATEGY_TYPES;

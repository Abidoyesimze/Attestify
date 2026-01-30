import { config as dotenvConfig } from "dotenv";
import type { HardhatUserConfig } from "hardhat/config";
import hardhatToolboxViem from "@nomicfoundation/hardhat-toolbox-viem";
import hardhatEthers from "@nomicfoundation/hardhat-ethers";

dotenvConfig();

const { PRIVATE_KEY, CELOSCAN_API_KEY, CELO_MAINNET_RPC } = process.env;

const config: HardhatUserConfig = {
  plugins: [hardhatToolboxViem, hardhatEthers],
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      type: "edr-simulated",
      forking: {
        url: CELO_MAINNET_RPC || "https://forno.celo.org",
        enabled: true,
      },
      chainId: 42220,
      hardfork: "cancun",
      allowUnlimitedContractSize: true,
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    celoMainnet: {
      type: "http",
      url: CELO_MAINNET_RPC || "https://forno.celo.org",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 42220,
    },
    celoAlfajores: {
      type: "http",
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 44787,
    },
    celoSepolia: {
      type: "http",
      url: "https://forno.celo-sepolia.celo-testnet.org/",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 11142220,
    },
  },
  etherscan: {
    apiKey: {
      celo: CELOSCAN_API_KEY || "abc",
      celoAlfajores: CELOSCAN_API_KEY || "abc",
      celoSepolia: CELOSCAN_API_KEY || "abc",
    },
    customChains: [
      {
        network: "celo",
        chainId: 42220,
        urls: {
          apiURL: "https://api.celoscan.io/api",
          browserURL: "https://celoscan.io",
        },
      },
      {
        network: "celoAlfajores",
        chainId: 44787,
        urls: {
          apiURL: "https://api-alfajores.celoscan.io/api",
          browserURL: "https://alfajores.celoscan.io",
        },
      },
      {
        network: "celoSepolia",
        chainId: 11142220,
        urls: {
          apiURL: "https://api-sepolia.celoscan.io/api",
          browserURL: "https://sepolia.celoscan.io",
        },
      },
    ],
  },
  sourcify: {
    enabled: true,
  },
};

export default config;


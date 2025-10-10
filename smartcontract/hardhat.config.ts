import type { HardhatUserConfig } from "hardhat/config";

import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-network-helpers";
import { configVariable } from "hardhat/config";

const config: HardhatUserConfig = {
  mocha: {
    timeout: 40000,
  },
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
    alfajores: {
      type: "http",
      chainType: "l1",
      url: process.env.ALFAJORES_RPC || "https://alfajores-forno.celo-testnet.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 44787,
    },
  },
};

export default config;

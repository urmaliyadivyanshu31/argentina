// Simplified config - removed toolbox for quick compile
require('dotenv').config({ path: '../.env' });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hyperevm: {
      url: process.env.HYPEREVM_RPC_URL || "https://api.hyperliquid-testnet.xyz/evm",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 998
    }
  }
};

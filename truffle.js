const HDWalletProvider = require("@truffle/hdwallet-provider");
require('dotenv').config()

module.exports = {
  contracts_directory: "./contracts/",
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      gas: 5000000,
      network_id: "*", // Match any network id
    },
    mumbai: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, `https://rpctest.quadrans.io`),
      network_id: 80001,
      chainId: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      gasPrice: "500000000",
      skipDryRun: true
    },
    ticino: {
      provider: () => new HDWalletProvider(process.env.TICINO_MNEMONIC, `https://rpctest.quadrans.io`),
      network_id: "*",
      confirmations: 2,
      timeoutBlocks: 200,
      gasPrice: "100000000",
      skipDryRun: true
    },
    quadrans: {
      provider: () => new HDWalletProvider(process.env.QUADRANS_MNEMONIC, `https://rpc.quadrans.io`),
      network_id: "*",
      confirmations: 2,
      timeoutBlocks: 200,
      gasPrice: "100000000",
      skipDryRun: true
    },
  },
  compilers: {
    solc: {
      version: "^0.8.4"
    },
  },
};

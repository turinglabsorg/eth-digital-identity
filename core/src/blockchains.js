
/**
 * Blockchains constants
 */

exports.blockchains = {
    ganache: {
        derivation_path: 'm/44\'/60\'/0\'/0',
        mainnet: {
            provider: "http://localhost:7545",
            chainId: 5777
        },
        testnet: {
            provider: "http://localhost:7545",
            chainId: 5777
        }
    },
    ethereum: {
        derivation_path: 'm/44\'/60\'/0\'/0',
        mainnet: {
            provider: "https://main-light.eth.linkpool.io/"
        },
        testnet: {
            provider: "https://rinkeby-light.eth.linkpool.io/"
        }
    },
    polygon: {
        derivation_path: 'm/44\'/60\'/0\'/0',
        mainnet: {
            provider: "https://rpc-mainnet.matic.network",
            gas_station: "https://gasstation-mainnet.matic.network",
            chainId: 137
        },
        testnet: {
            provider: "https://rpc-mumbai.matic.today",
            gas_station: "https://gasstation-mumbai.matic.today/",
            chainId: 80001
        }
    },
    quadrans: {
        derivation_path: 'm/44\'/60\'/0\'/0',
        mainnet: {
            provider: "https://rpc.quadrans.io",
            chainId: 10946
        },
        testnet: {
            provider: "https://rpctest.quadrans.io",
            chainId: 10947
        }
    },
    bsc: {
        derivation_path: 'm/44\'/60\'/0\'/0',
        mainnet: {
            provider: "https://bsc-dataseed.binance.org/",
            gas_station: "https://bscgas.info/gas",
            chainId: 56
        },
        testnet: {
            provider: "https://data-seed-prebsc-1-s1.binance.org:8545/",
            chainId: 97
        }
    }
};

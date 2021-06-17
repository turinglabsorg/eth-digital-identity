# Ethereum DID Javascript Library

This library is intended to be used as a multi-tool to create and manage Ethereum-based identities and interact with different networks.

Can be also used with the related smart contract that allows you to connect one or more encrypted values to hashes and identities.

Please be 100% you understand that data inside the blockchain are public, so please be sure to use strong-encrypted values or hashes.

## Main features

This library will work with both NodeJS and Browser and it can be used to accomplish following operations:

- Store and manage mnemonic passphrases in browser or simply local storage
- Connect to multiple blockchain providers (Ethereum, Polygon, Quadrans)
- Init contract instances and interact with them
- Use utilities like encryption and hashing functions

## WIP features

- Interact directly with a dID contract
- Use same features with a CLI interface
- Add more EVM-based blockchains

## Use the library

Start with inserting it inside a NodeJS project:

```
yarn add eth-did-core
```

Then create a new instance:

```
const EthDiD = require('eth-did-core')
const core = new EthDiD()
```

You can access the tests by running following commands:

```
npm run test:wallet
npm run test:rpc
npm run test:contract
```

### Create and manage a new wallet

```
/* Create a new wallet */
const wallet = await core.createWallet('MySuperPassword', true, 'MySmartAlias')

/* Derive a key */
const derived = await core.deriveKeyFromMnemonic(wallet.mnemonic, 'ethereum', 'm/0')

/* Return the wallet with alias or hash */
const local = await core.returnWallet('MySmartAlias')

/* Decrypt the wallet */
const decrypted = await core.decryptWallet(wallet.hash, 'MySuperPassword')
```

### Connect to web3

```
/* Connect to selected network */
await core.connect(mnemonic, 'ganache')

/* Use classic Web3 methods */
const balance = await core.web3.eth.getBalance(wallet.address)
```

If you want to setup your own JSON-RPC nodes you can setup in this way (if you want, for example, connect to your infura account):

```
core.blockchains['ethereum']['mainnet'].provider = 'https://mainnet.infura.io/v3/YourApiKey'
```

### Interact with contract

```
/* First connect to selected network */
await core.connect(mnemonic, 'ganache')

/* Init contract by passing ABI and address */
const contract = await core.initContract(ABI, CONTRACT_ADDRESS)

/* Interact with selected contract */
await contract.methods.registerIdentity('something', 'something else').send({ from: wallet.address })
```
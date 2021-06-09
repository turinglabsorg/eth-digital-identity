const HDWalletProvider = require("@truffle/hdwallet-provider");
const web3 = require("web3");
require('dotenv').config()
const MNEMONIC = process.env.GANACHE_MNEMONIC;
const CONTRACT_ADDRESS = process.env.GANACHE_CONTRACT;
const OWNER_ADDRESS = process.env.GANACHE_OWNER;
const ABI = require('../abi.json')

async function main() {
  const provider = new HDWalletProvider(
    MNEMONIC,
    "http://localhost:7545"
  );
  const web3Instance = new web3(provider);

  const contract = new web3Instance.eth.Contract(
    ABI,
    CONTRACT_ADDRESS,
    { gasLimit: "5000000" }
  );

  try {
    console.log('Adding identity...')
    const identity = 'Identity'
    await contract.methods.add(identity).send({ from: OWNER_ADDRESS })
    const stored = await contract.methods.eid().call()
    if (identity === stored) {
      console.log('Identity added successfully!')
    } else {
      console.log('Something goes wrong')
    }
  } catch (e) {
    console.log(e)
  }

}

main();

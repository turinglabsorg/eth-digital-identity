const EthDiD = require('../src/core')
const core = new EthDiD()
core.debug = true
const ABI = require('./abi_did.json')
const CONTRACT_ADDRESS = '0x1bB99c6612BE6100f4527d715E11E2719C4B55A2'

async function test() {
    const mnemonic = 'tuna cousin glove box ball execute fluid parent fog client blur finger'
    const wallet = await core.deriveKeyFromMnemonic(mnemonic, 'ganache', 'm/0')
    console.log('Derive address from mnemonic')
    console.log(wallet)
    console.log('--')
    console.log('Connecting to Web3')
    console.log('--')
    await core.connect('ganache', mnemonic)
    const contract = await core.initContract(ABI, CONTRACT_ADDRESS)
    if (contract !== false) {
        const identity = 'EncryptedData'
        const public_hash = 'PublicHash'
        console.log('Adding identity to contract')
        try {
            await contract.methods.registerIdentity(identity, public_hash).send({ from: wallet.address })
            console.log('Identity added')
        } catch (e) {
            console.log(e.message)
        }
        console.log('--')
        console.log('Fetching stored data')
        const stored = await contract.methods.returnVault().call({ from: wallet.address })
        console.log('STORED:', stored)
    } else {
        console.log("Can't initiate contract, please check informations")
    }
}

test()
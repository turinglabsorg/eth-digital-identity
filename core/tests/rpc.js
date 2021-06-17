const EthDiD = require('../src/core')
const core = new EthDiD()
core.debug = true

async function test() {
    const mnemonic = 'tuna cousin glove box ball execute fluid parent fog client blur finger'
    const wallet = await core.deriveKeyFromMnemonic(mnemonic, 'ganache', 'm/0')
    console.log('Derive address from mnemonic')
    console.log(wallet)
    console.log('--')
    console.log('Connecting to Web3')
    console.log('--')
    await core.connect('ganache', mnemonic)
    const balance = await core.web3.eth.getBalance(wallet.address)
    console.log('Balance is:', balance)
    console.log('Disconnecting from Web3')
    console.log('--')
    await core.disconnect()
    console.log('Trying to call without connection')
    console.log('--')
    try {
        await core.web3.eth.getBalance(wallet.address)
    } catch (e) {
        console.log('Call errored correctly')
    }
}

test()
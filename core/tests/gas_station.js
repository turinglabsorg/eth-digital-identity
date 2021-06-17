const EthDiD = require('../src/core')
const core = new EthDiD()
core.debug = true

async function test() {
    console.log('Connecting to Web3')
    console.log('--')
    const wallet = await core.createWallet('MySuperPassword', true, 'MySmartAlias')
    await core.connect(wallet.mnemonic, 'ethereum', 'mainnet')
    console.log('Asking for gas price')
    console.log('--')
    let price = await core.returnGasPrice('fast')
    console.log('GAS PRICE IS: ' + price)
}

test()
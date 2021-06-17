const EthDiD = require('../src/core')
const core = new EthDiD()
core.debug = true

async function test() {
    console.log('Creating new mnemonic wallet')
    console.log('--')
    const wallet = await core.initPhisicalWallet('MyUniqueHashOrIdentifier', 'MySuperPassword', true, 'MySmartAlias')
    console.log(wallet)
}

test()
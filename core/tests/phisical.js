const EthDiD = require('../src/core')
const core = new EthDiD()
core.debug = true

async function test() {
    console.log('Deriving wallet from phisical address')
    console.log('--')
    const wallet = await core.initPhisicalWallet('MyUniqueHashOrIdentifierHashOrSomethingLongerThan16Characters', 'MySuperPassword', true, 'MySmartAlias')
    console.log('--')
    console.log(wallet)
}

test()
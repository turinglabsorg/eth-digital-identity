const EthDiD = require('../src/core')
const core = new EthDiD()
core.debug = true

async function test() {
    console.log('Importing wallet')
    console.log('--')
    const eid = "7d4f4ed0e6a0139d*7f80ff3fd784eb457f9e6fe4f63be3a08fe08252dfda7ddfe4646cb0f638b1f9a27a8e616617e3d34dcda5c41b9ade9d1527af795edd89dfb9b46e5de14cf414a02e25526cbc84884354d640209a0b9c69bf32c40313acb71e193e0ffc48c274f83935d2d0ab87f9678477bf8342f5845f2592256eb72c702bb0ead6fdb6c7fed195f43d8f26eedd553213be64aef56f"
    const password = "2210"
    const wallet = await core.importWallet(eid, password, true, 'MySmartAlias')
    console.log('--')
    console.log(wallet)
}

test()
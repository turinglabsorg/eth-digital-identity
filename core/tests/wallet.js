const EthDiD = require('../src/core')
const core = new EthDiD()
core.debug = true

async function test() {
    console.log('Creating new mnemonic wallet')
    console.log('--')
    const wallet = await core.createWallet('MySuperPassword', true, 'MySmartAlias')
    console.log(wallet)
    console.log('--')
    console.log('Deriving keys from mnemonic')
    const derived = await core.deriveKeyFromMnemonic(wallet.mnemonic, 'ethereum', 'm')
    console.log(derived)
    console.log('--')
    console.log('Returning wallet from local database')
    // Can return wallet by Alias or Hash
    const local = await core.returnWallet('MySmartAlias')
    console.log(local)
    console.log('--')
    console.log('Decrypting the wallet')
    const decrypted = await core.decryptWallet(wallet.hash, 'MySuperPassword')
    console.log(decrypted)
    console.log('--')
}

test()
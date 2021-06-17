const axios = require('axios')
const { sum, round, subtract } = require('mathjs')
const homedir = require('os').homedir() + '/.ethdid'
const fs = require('fs')
const bip39 = require('bip39')
const HDKey = require('hdkey')
var qrcode = require('qrcode-terminal')
const crypto = require('crypto')
const ethWallet = require('ethereumjs-wallet')
const StormDB = require("stormdb")
const HDWalletProvider = require("@truffle/hdwallet-provider")
const web3 = require("web3")
const { blockchains } = require('./blockchains')

module.exports = class EthDiD {

    constructor(isBrowser = false) {
        this.debug = false
        this.cli = false
        this.isBrowser = isBrowser
        this.blockchains = blockchains
        this.web3 = {}
        this.provider = {}
        this.blockchain = ''
        this.network = ''
        this.math = {
            sum: sum,
            round: round,
            subtract: subtract
        }
        if (!this.isBrowser) {
            if (this.debug) {
                console.log('Initializing homedir');
            }
            if (!fs.existsSync(homedir)) {
                fs.mkdirSync(homedir)
            }
            const engine = new StormDB.localFileEngine(homedir + "/wallets");
            this.db = new StormDB(engine);
        } else {
            const engine = new StormDB.browserEngine("db");
            this.db = new StormDB(engine);
        }
        this.db.default({ wallets: [] });
    }

    /**
     * Utilities functions
     */

    async encrypt(data, password) {
        return new Promise(response => {
            let iv = crypto.randomBytes(16)
            let key = crypto.createHash('sha256').update(String(password)).digest('base64').substr(0, 32)
            let cipher = crypto.createCipheriv('aes-256-ctr', key, iv);
            let encrypted = cipher.update(data);
            encrypted = Buffer.concat([encrypted, cipher.final()]);
            let hex = iv.toString('hex') + '*' + encrypted.toString('hex')
            response(hex)
        })
    }

    async decrypt(data, password, buffer = false) {
        return new Promise(response => {
            try {
                let textParts = data.split('*');
                let iv = Buffer.from(textParts.shift(), 'hex')
                let encryptedText = Buffer.from(textParts.join('*'), 'hex')
                let key = crypto.createHash('sha256').update(String(password)).digest('base64').substr(0, 32)
                let decipher = crypto.createDecipheriv('aes-256-ctr', key, iv)
                let decrypted = decipher.update(encryptedText)
                decrypted = Buffer.concat([decrypted, decipher.final()])
                if (buffer === false) {
                    response(decrypted.toString())
                } else {
                    response(decrypted)
                }
            } catch (e) {
                response(false)
            }
        })
    }

    hash(text) {
        return new Promise(response => {
            let buf = Buffer.from(text)
            var sha = crypto.createHash('sha256').update(buf).digest()
            response(sha.toString('hex'))
        })
    }

    /**
     * Wallet functions
     */

    createWallet(password, save = false, alias = '') {
        return new Promise(async response => {
            if (this.cli || this.debug) {
                console.log('Creating new wallet with password: ' + password)
            }

            const mnemonic = bip39.generateMnemonic(256)
            let encrypted = await this.encrypt(mnemonic, password)
            let hash = await this.hash(mnemonic)
            let decrypted = await this.decrypt(encrypted, password)
            if (decrypted === mnemonic) {
                if (this.cli || this.debug) {
                    console.log('This is your mnemonic phrase, store it safely in your preferred support:')
                    console.log('\x1b[32m%s\x1b[0m', mnemonic)
                    console.log('This is the hash representing the wallet:')
                    console.log('\x1b[32m%s\x1b[0m', hash)
                }
                const master = await this.deriveKeyFromMnemonic(mnemonic, 'ethereum', 'm')

                const wallet = {
                    mnemonic: mnemonic,
                    eid: encrypted,
                    hash: hash,
                    master: master.address
                }

                this.db.get("wallets").push({
                    hash: hash,
                    alias: alias,
                    eid: encrypted,
                    master: master.address
                });
                this.db.save();

                response(wallet)
            } else {
                if (this.cli || this.debug) {
                    console.log('There was an error while encrypting the file, please retry.')
                }
                response(false)
            }
        })
    }

    returnWallet(hashOrAlias = '') {
        return new Promise(async response => {
            if (this.cli || this.debug) {
                console.log('Returning wallet: ' + hashOrAlias)
            }
            const wallets = await this.db.get("wallets").value()
            if (hashOrAlias !== '') {
                let wallet = wallets.filter(w => w.hash === hashOrAlias)
                if (wallet[0] !== undefined) {
                    response(wallet[0])
                } else {
                    wallet = wallets.filter(w => w.alias === hashOrAlias)
                    if (wallet[0] !== undefined) {
                        response(wallet[0])
                    } else {
                        response(false)
                    }
                }
            } else {
                response(wallets[0])
            }
        })
    }

    decryptWallet(hashOrAlias, password) {
        return new Promise(async response => {
            if (this.cli || this.debug) {
                console.log('Decrypting wallet: ' + hashOrAlias)
            }
            const wallet = await this.returnWallet(hashOrAlias)
            if (wallet !== false) {
                const decrypted = await this.decrypt(wallet.eid, password)
                response(decrypted)
            }
        })
    }

    deriveKeyFromMnemonic(mnemonic, blockchain, path) {
        return new Promise(async response => {
            if (this.blockchains[blockchain] !== undefined) {
                const hdwallet = ethWallet.hdkey.fromMasterSeed(await bip39.mnemonicToSeed(mnemonic));
                const derivePath = hdwallet.derivePath(this.blockchains[blockchain].derivation_path).derivePath(path)
                const privkey = derivePath.getWallet().getPrivateKeyString();
                const wallet = ethWallet.default.fromPrivateKey(Buffer.from(privkey.replace('0x', ''), 'hex'));
                const address = wallet.getAddressString()
                const pubkey = wallet.getPublicKey().toString('hex')
                response({
                    privkey: privkey,
                    pubkey: pubkey,
                    address: address
                })
            } else {
                if (this.debug) {
                    console.log('Blockchain `' + blockchain + '` is not supported.')
                }
                response(false)
            }
        })
    }

    /**
     * RPC functions
     */
    connect(mnemonic, blockchain, network = 'mainnet') {
        return new Promise(response => {
            if (this.blockchains[blockchain] !== undefined) {
                if (this.blockchains[blockchain][network] !== undefined) {
                    if (this.blockchains[blockchain][network].provider !== "") {
                        this.blockchain = blockchain
                        this.network = network
                        this.provider = new HDWalletProvider({
                            mnemonic: mnemonic,
                            providerOrUrl: this.blockchains[blockchain][network].provider,
                            shareNonce: false
                        })
                        this.web3 = new web3(this.provider)
                        response(true)
                    } else {
                        if (this.debug) {
                            console.log('Provider is not defined.')
                        }
                        response(false)
                    }
                } else {
                    if (this.debug) {
                        console.log('Network `' + network + '` is not supported.')
                    }
                    response(false)
                }
            } else {
                if (this.debug) {
                    console.log('Blockchain `' + blockchain + '` is not supported.')
                }
                response(false)
            }
        })
    }

    disconnect() {
        return new Promise(async response => {
            await this.provider.engine.stop();
            this.web3 = {}
            response(true)
        })
    }

    initContract(abi, contract_address, gasPrice = '', gasLimit = '') {
        return new Promise(async response => {
            if (this.blockchains[this.blockchain] !== undefined) {
                if (this.blockchains[this.blockchain][this.network] !== undefined) {
                    if (this.blockchains[this.blockchain][this.network].provider !== "") {
                        if (this.provider !== {}) {
                            try {
                                if(gasPrice === ''){
                                    gasPrice = await this.web3.eth.getGasPrice()
                                }
                                const contract = new this.web3.eth.Contract(
                                    abi,
                                    contract_address,
                                    { gasLimit: gasLimit, gasPrice: gasPrice }
                                )
                                response(contract)
                            } catch (e) {
                                response(false)
                            }
                        } else {
                            if (this.debug) {
                                console.log('Please connect web3 provider first.')
                            }
                            response(false)
                        }
                    } else {
                        if (this.debug) {
                            console.log('Provider is not defined.')
                        }
                        response(false)
                    }
                } else {
                    if (this.debug) {
                        console.log('Network `' + network + '` is not supported.')
                    }
                    response(false)
                }
            } else {
                if (this.debug) {
                    console.log('Blockchain `' + blockchain + '` is not supported.')
                }
                response(false)
            }
        })
    }

    returnGasPrice(type = 'fast', blockchain = '', network = '') {
        return new Promise(async response => {
            try {
                if (blockchain === '') {
                    blockchain = this.blockchain
                }
                if (network === '') {
                    network = this.network
                }
                if (blockchain !== '') {
                    let gas_station = await this.blockchains[blockchain][network].gas_station
                    if (gas_station !== undefined) {
                        let prices = await axios.get(gas_station)
                        try {
                            const selected = prices.data[type].toString()
                            const toWei = this.web3.utils.toWei(selected, 'gwei')
                            response(toWei)
                        } catch (e) {
                            if (this.debug) {
                                console.log(e.message)
                            }
                            response(false)
                        }
                    } else {
                        const web3GasPrice = await this.web3.eth.getGasPrice()
                        response(web3GasPrice)
                    }
                } else {
                    response(false)
                }
            } catch (e) {
                if (this.debug) {
                    console.log(e.message)
                }
                response(false)
            }
        })
    }
}
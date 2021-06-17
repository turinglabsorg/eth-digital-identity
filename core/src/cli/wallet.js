const EthDiD = require('../core')
const prompts = require('prompts')

/**
 * This function will stop the EthDiD server
 */

exports.create = async function () {
    try {
        const core = new EthDiD()
        core.cli = true
        const prompt = await prompts([
            {
                type: 'text',
                name: 'password',
                message: 'Choose a password for your new wallet',
                validate: password => password.length < 6 ? `Password must be at least 6 characters` : true
            },
            {
                type: 'text',
                name: 'alias',
                message: 'Choose an alias (not required)'
            }
        ]);
        await core.createWallet(prompt.password, true, prompt.alias)
    } catch (e) {
        console.log(e)
    }
}
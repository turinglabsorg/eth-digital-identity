const axios = require("axios")
const DAEMON_URL = 'http://localhost:3003'

/**
 * This function will stop the EthDiD server
 */

exports.stop = async function () {
    try {
        let response = await axios.get(DAEMON_URL + '/stop')
        console.log(response.data)
    } catch (e) {
        console.log('Can\'t stop EthDiD daemon, server not responding.')
    }
}
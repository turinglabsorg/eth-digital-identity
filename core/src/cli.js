#!/usr/bin/env node

const core = require('./core')
const fs = require('fs')
const argv = require('minimist')(process.argv.slice(2))
const axios = require("axios")
const server = require('./cli/server.js')
const wallet = require('./cli/wallet.js')

const commands = {
    server: server,
    wallet: wallet
}

async function cli() {
    if (argv._.length >= 2) {
        if (commands[argv._[0]] !== undefined) {
            if (commands[argv._[0]][argv._[1]] !== undefined) {
                commands[argv._[0]][argv._[1]](argv)
            }else{
                console.log('Method ' + argv._[1] + ' not found in ' + argv._[0] + '.')
            }
        } else {
            console.log('Command ' + argv._[0] + ' not recognized.')
        }
    } else {
        process.exit()
    }
}

cli()
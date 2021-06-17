#!/usr/bin/env node

const express = require('express')
const app = express()
const port = 3003

app.get('/', (req, res) => {
    res.send('EthDiD server is working!')
})

app.get('/stop', (req, res) => {
    setTimeout(function(){
        process.exit()
    }, 300)
    res.send('EthDiD server is stopping.')
})

app.listen(port, () => {
    console.log(`EthDiD listening at port ${port}`)
})

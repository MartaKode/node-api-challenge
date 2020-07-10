const express = require('express') //import express

const apiRouter = require('./apiRouter.js') //import routers

const server = express()

server.get('/', (req,res) => {
    res.send('<h1>Marta`s sprint challenge home page </h1>')
})

server.use('/api', apiRouter)

module.exports = server


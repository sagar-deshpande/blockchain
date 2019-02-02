const express = require('express')
const BlockChain = require('./blockchain')
const bodyParser = require('body-parser')
const PubSub = require('./pubsub')

const app = express();
const blockchain = new BlockChain()
const pubsub = new PubSub( { blockchain } )

setTimeout( () => pubsub.broadcastChain(), 1000);

app.use(bodyParser.json())

app.get("/api/blocks", (req, res) => {
    res.json(blockchain.chain)    
}) 

app.post("/api/mine", (req, res) => {
    const { data } = req.body;
    blockchain.addBlock( { data })
    res.redirect('/api/blocks');
})

app.listen(3000, () => {
    console.log("app started at port: 3000")
})


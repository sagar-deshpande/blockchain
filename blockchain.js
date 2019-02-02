const Block = require('./block')
const cryptoHash = require('./crypto-hash')

class BlockChain {
    
    constructor() {
        this.chain = [Block.genesis()]
    }

    addBlock({data}) {
        const lastBlock = this.chain[this.chain.length - 1]
        const timestamp = Date.now()
        const lasthash = lastBlock.lasthash
        const hash = cryptoHash(timestamp,lasthash,data)
        const newBlock = Block.mineBlock({ lastBlock, data })
        this.chain.push(newBlock)
    }
/*
    isValidChain() {
        if (JSON.stringify(this.chain[0]) !== JSON.stringify(Block.genesis())) {
            return false
        }
        for (let i = 1; i< this.chain.length; i++) {
            const lastBlock = this.chain[i-1]
            const currentBlock = this.chain[i]
            if (currentBlock.lasthash !== lastBlock.hash) {
                return false
            }
            const expectedHash = cryptoHash(currentBlock.timestamp, currentBlock.lasthash, currentBlock.data)
            if (expectedHash !== currentBlock.hash) {
                return false
            }
        }
        return true

    }
    */

    isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false

        for (let i =1; i<chain.length; i++) {
            const lastBlock = chain[i-1]
            const currentBlock = chain[i]

            if (currentBlock.lasthash !== lastBlock.hash) return false

            const expectedHash = cryptoHash(currentBlock.timestamp, 
                                            currentBlock.lasthash, 
                                            currentBlock.data, 
                                            currentBlock.nonce, 
                                            currentBlock.difficulty)
            if (expectedHash !== currentBlock.hash) return false

            if ( Math.abs(currentBlock.difficulty - lastBlock.difficulty) > 1 ) return false
        }

        return true
    }

    replaceChain(chain) {
        if (this.chain.length >= chain.length ) return
        if (this.isValidChain(chain) == false) return
        this.chain = chain  
    }
}

module.exports = BlockChain
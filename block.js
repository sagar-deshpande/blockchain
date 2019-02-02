const { GENESIS, MINE_RATE } = require('./config')
const cryptoHash = require('./crypto-hash')
const hexToBin = require('hex-to-binary')

class Block {
    constructor ( { timestamp, data, lasthash, hash, nonce, difficulty }) {
        this.timestamp  = timestamp,
        this.data       = data,
        this.lasthash   = lasthash,
        this.hash       = hash,
        this.nonce      = nonce,
        this.difficulty = difficulty
    }

    static genesis () {
        return new Block( GENESIS );
    }

    static mineBlock ( {lastBlock, data } ) {
      //  let nonce, timestamp;
        
      //  const timestamp = Date.now();
        const lasthash = lastBlock.hash;
        let hash;
      //  const hash = cryptoHash(timestamp,lasthash, data)
        let difficulty = { lastBlock }
        let nonce = 0;
        let timestamp;
        do {

            nonce += 1
            timestamp = Date.now(),
            difficulty = Block.adjustDifficulty({ originalBlock: lastBlock, timestamp})
            hash = cryptoHash(timestamp,lasthash, data, nonce, difficulty)

        }while( hexToBin(hash).substring(0, difficulty) != '0'.repeat(difficulty));
        
        return new Block( { timestamp, data, lasthash, hash, nonce, difficulty })
    }

    static adjustDifficulty ({ originalBlock, timestamp}) {

        const { difficulty } = originalBlock
        if (difficulty <= 1) return 1
        const difference = timestamp - originalBlock.timestamp
        if (difference > MINE_RATE) return difficulty - 1
        if (difference < MINE_RATE) return difficulty + 1
        
    }


}

module.exports = Block
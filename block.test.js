const Block = require('./block')
const { GENESIS, MINE_RATE } = require('./config')
const cryptoHash = require('./crypto-hash')
const hexTobin = require('hex-to-binary')

describe('Block', () => {
    const timestamp = 2000;
    const data = 'Genesis';
    const lasthash = '0';
    const hash = 'genesis hash';
    const nonce = 1;
    const difficulty = 3;
    const block = new Block({ timestamp, data, lasthash, hash, nonce, difficulty });

    it ("has all required properties", () => {
        expect(block.data).toEqual(data);
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lasthash).toEqual(lasthash);
        expect(block.hash).toEqual(hash);
        expect(block.nonce).toEqual(nonce);
        expect(block.difficulty).toEqual(difficulty);
    })

   describe("genesis()", () => {
        const genesisData = Block.genesis()

        it ("genesisData is of type block", () => {
            expect(genesisData instanceof Block).toBe(true);
        })

        it ("Matches with genesis data: ", () => {
            expect(genesisData).toEqual(GENESIS);
        })
   })

   describe ("mineBlock()", () => {
       const lastBlock = Block.genesis();
       const data = "Next block";
       const minedBlock = Block.mineBlock({lastBlock, data});

       it("returns a block instance", () => {
           expect(minedBlock instanceof Block).toBe(true)
       })

       it ("sets the lasthash to the genesis hash", () => {
           expect(minedBlock.lasthash).toEqual('genesis hash')
       })

       it ("sets the data correctly", () => {
           expect(minedBlock.data).toEqual(data);
       })

       it ("sets the timestamp", () => {
           expect(minedBlock.timestamp).not.toEqual(undefined)
       })

       it ("creates SHA 256 hash on proper inputs", () => {
           const expecedHash = cryptoHash(minedBlock.timestamp, 
                                          minedBlock.lasthash, 
                                          minedBlock.data, 
                                          minedBlock.nonce, 
                                          minedBlock.difficulty);
           expect(minedBlock.hash).toEqual(expecedHash);
       })

       it ("sets a hash that matches the crieteria", () => {
           expect(hexTobin(minedBlock.hash).substring(0, minedBlock.difficulty)).toEqual('0'.repeat(minedBlock.difficulty))
       }) 

       it ("adjusts the difficulty", () => {
           const possibleResult = [lastBlock.difficulty + 1, lastBlock.difficulty - 1]
           expect(possibleResult.includes(minedBlock.difficulty)).toBe(true)
       })
   })

   describe("adjustDifficulty()", () => {
       it ("raises the difficulty for quickly mined block", () => {
        
            expect(Block.adjustDifficulty( { originalBlock: block,
                                            timestamp: block.timestamp + MINE_RATE - 100 })
                                            ).toEqual(block.difficulty + 1)
       })

       it ("lowers the difficulty for slowly mined block", () => {
            expect(Block.adjustDifficulty( { originalBlock: block,
                                             timestamp: block.timestamp + MINE_RATE + 100 })
            ).toEqual(block.difficulty - 1)
       })

       it ("has a lower limit 1", () => {
           block.difficulty = -1
           expect(Block.adjustDifficulty( {originalBlock: block, 
                                           timestamp: block.timestamp}))
       }) 
   })
})
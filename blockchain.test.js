const BlockChain = require('./blockchain')
const Block = require('./block')

describe("BlockChain() ", () => {
    
    let blockchain, newChain, originalChain
    beforeEach(() => {
        blockchain = new BlockChain();
     //   newChain = new BlockChain();
     //   originalChain = BlockChain.chain;
    }) 

    it ("contains a chain array", () => {
        expect(blockchain.chain instanceof Array).toBe(true);
    })

    it ("starts with a genesis blocks", () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis())
    })

    it ("add a new block to the chain", () => {
        blockchain.addBlock({ data: "test block"});
        expect(blockchain.chain[blockchain.chain.length -1].data).toEqual("test block")
    })

    describe("validateChain()", () => {

        beforeEach(() => {
            blockchain.addBlock({ data: "myTest-1"})
            blockchain.addBlock({ data: "myTest-2"})
            blockchain.addBlock({ data: "myTest-3"})
        })
        describe("when the chain does not starts with the valid block", () => {
            it ("returns false", () => {
                blockchain.chain[0].data = "tampered";
                expect(blockchain.isValidChain(blockchain.chain)).toBe(false);
            })
        })

        describe("when chain starts with valid block", () => {
            describe("lasthash gets changed", () => {
                it ("returns false", () => {
                    blockchain.chain[2].lasthash = "tampered hash";
                    expect(blockchain.isValidChain(blockchain.chain)).toBe(false)
                })
            })

            describe("when chain conatins invalid data", () => {
                it ("returns false", () => {
                    blockchain.chain[2].data = "bad-data"
                    expect(blockchain.isValidChain(blockchain.chain)).toBe(false)
                })
            })

            describe("Difficulty jumps detect", () => {
                it ("returns false", () => {
                    blockchain.chain[1].difficulty = 3
                    expect(blockchain.isValidChain(blockchain.chain)).toBe(false)
                })
            })

            describe("chain is valid", () => {
                it ("returns true", () => {
                    expect(blockchain.isValidChain(blockchain.chain)).toBe(true)
                })
            })
        })


    })

    describe("replaceChain()", () => {
        beforeEach(() => {
            blockchain.addBlock({ data: "myTest-1"})
            blockchain.addBlock({ data: "myTest-2"})
            blockchain.addBlock({ data: "myTest-3"})
            newChain = new BlockChain()
            newChain.addBlock({ data: "myTest-1"})
            newChain.addBlock({ data: "myTest-2"})
            newChain.addBlock({ data: "myTest-3"})
            originalChain = blockchain.chain
        })
        describe("chain is not long", () => {
            it ("chain does not replaced", () => {
                newChain.chain[2].data = "New chain block"
                blockchain.replaceChain(newChain.chain)
                expect(blockchain.chain).toEqual(originalChain)
            })
        })

        describe("chain is longer", () => {
            beforeEach(() => {
                newChain.addBlock({ data: "myNewData"})
            })
            describe("chain is invalid", () => {
                it ("does not replace chain", () => {
                    newChain.chain[0].data = "Invalid data"
                    blockchain.replaceChain(newChain.chain)
                    expect(blockchain.chain).toEqual(originalChain)
                })
            })

            describe("chain is valid", () => {
                it ("replace chain", () => {
                    blockchain.replaceChain(newChain.chain)
                    expect(blockchain.chain).not.toEqual(originalChain)
                })
            })
        })
    }) 
})
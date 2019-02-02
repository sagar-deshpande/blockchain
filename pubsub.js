const redis = require('redis')
const BlockChain = require('./blockchain')

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN'
}

const blockchain = new BlockChain();
 class PubSub {
     constructor({ blockchain }) {
         this.blockchain = blockchain
         this.publisher = redis.createClient();
         this.subscriber = redis.createClient();

        // this.subscriber.subscribe(CHANNELS.TEST);

         this.subscribeToChannel();

         this.subscriber.on("message", (channel, message) => {

            this.handleMessage(channel, message)

         } )
     }

     subscribeToChannel() {
         Object.values(CHANNELS).array.forEach(channel => {
             this.subscriber.subscribe(channel)
         });
     }

     publish({ channel, message }) {
        this.publisher.publish(channel, message);
     }

     handleMessage(channel, message) {
         console.log("Message Received. Channel: "+channel + ". Message: "+ message);

         const receivedChain = JSON.parse(message)

         if (channel === CHANNELS.BLOCKCHAIN ) {
             this.blockchain.replaceChain(receivedChain)
         }

     }

     broadcastChain() {
         this.publish({
             channel: CHANNELS.BLOCKCHAIN,
             message: JSON.stringify(blockchain.chain) 
         })
     }
 }

 const testPubSub = new PubSub();
 setTimeout(() =>testPubSub.publisher.publish(CHANNELS.TEST, "test msg"), 1000);
 module.exports = PubSub
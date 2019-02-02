const PubNub = require('pubnub')

const credentials = {
    publishKey   : 'pub-c-58dae4c4-4a11-4ff5-ad98-a69bf5c086bc',
    subscribeKey : 'sub-c-5d1ca66a-2308-11e9-b712-2656c4b29a42',
    secretKey    : 'sub-c-5d1ca66a-2308-11e9-b712-2656c4b29a42'
}

const CHANNEL = {
    TEST : 'TEST',
    TESTTWO : 'TESTTWO',
    BLOCKCHAIN : 'BLOCKCHAIN'
}

class PubSub {
    constructor(blockchain) {
        this.blockchain = blockchain;
        this.pubnub = new PubNub(credentials);
        this.pubnub.subscribe( { channel: [Object.values(CHANNEL)] });
        this.pubnub.addListener( this.listener())
    }

    listener() {
        try {
            return {
                message: messageObject => {
                    const { channel, message } = messageObject
                    console.log("Message received on channel "+channel + ". Message is "+message);
                    if (channel === CHANNEL.BLOCKCHAIN) {
                        this.blockchain.replaceChain(parsedMessage);
                    }
                }
            }
        }
        catch(e) {
            console.log(e)
        }    
        
        /*
        const parsedMessage = JSON.parse(message)

        if (channel === CHANNEL.BLOCKCHAIN) {
            this.blockchain.replaceChain(parsedMessage);
        }*/
    }

    subscribeToChannel() {
        try {
            this.pubnub.subscribe( {
                channels : [Object.values(CHANNEL)]
            })
        }
        catch(e)
        {
            console.log(e)
        }        
    }
    
    publish( {channel, message}) {

        
        this.pubnub
        .publish( {channel, message })
          .then(result => {
            // you probably should handle this when successful?
          })
          .catch(error => {  // catch the errors
            console.log(error);
          })       
        
            
    }
    

    broadcastChain() {

        try {

            this.publish( { 
                channel: CHANNEL.BLOCKCHAIN,
                message: JSON.stringify(this.blockchain.chain)
            })
        }

        catch(e) {
            console.log(e)
        }
        
    }
    
    
}

var promise1 = new PubSub(function(resolve, reject) {
    throw "error"
  })

  const pubsub = new PubSub();
pubsub.publish( { channel: CHANNEL.TEST, message: "Hello PubNub"})

//const pubsub = new PubSub();
//pubsub.publish( { channel: CHANNEL.TEST, message: "Hello PubNub"})

/*
promise1.then (() => {
const pubsub = new PubSub();
pubsub.publish( { channel: CHANNEL.TEST, message: "Hello PubNub"})
})
.catch(error => 
    console.log(error)
)*/

module.exports = PubSub
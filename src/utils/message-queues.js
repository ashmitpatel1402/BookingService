const amqplib=require('amqplib');

const {MESSAGE_BROKER_URL,EXCHANGE_NAME}=require('../config/serverconfig');

const createChannel=async()=>{
    try{
        const connection=await amqplib.connect(MESSAGE_BROKER_URL);
        const channel=await connection.createChannel();
        await channel.assertExchange(EXCHANGE_NAME,'direct',false);//search for exchange in rabbitmq if absent creates one
        return channel;
    }catch(error){
        throw{error};
    }
}

const subscribeMessage=async (channel,service,binding_key)=>{
    try
     {
    
    const applicationQueue=await channel.assertQueue('REMINDER_QUEUE');

    channel.bindQueue(applicationQueue.queue,EXCHANGE_NAME,binding_key);

    channel.consume(applicationQueue.queue,msg=>{
        console.log("Received Data");
       // console.log(msg.content.toString());
        //const payload=JSON.parse(msg.content.toString());
       // service(payload);
        channel.ack(msg);//this message is consumed remove from queue
    });
} catch(error){
    throw{error};
}
}

const publishMessage=async (channel,binding_key,message)=>{
    try{
        await channel.assertQueue('REMINDER_QUEUE');//CREATING THE QUEUE
        await channel.publish(EXCHANGE_NAME,binding_key,Buffer.from(message));//buffer to convert message from binary to utf8 encoding
    }catch(error){
        throw{error};
    }
}

module.exports={
    subscribeMessage,
    createChannel,
    publishMessage
}
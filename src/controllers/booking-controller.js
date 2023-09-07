const { BookingService }=require('../services/index');
const { StatusCodes }=require('http-status-codes');
const bookingService=new BookingService();
const{createChannel,publishMessage}=require('../utils/message-queues');

const {REMINDER_BINDING_KEY}=require('../config/serverconfig');
class BookingController {
    async sendMessageToQueue(req,res){
        const channel=await createChannel();
        const payload={
            data:{
                subject:'This is a notice from queue',
                content:"Some queue will subscribe to the event",
                recepientEmail:'rem@gmail.com',
                notificationTime:'2023-09-08T09:49:00'
            },
            service:'CREATE_TICKET'
        }
        publishMessage(channel,REMINDER_BINDING_KEY,JSON.stringify(payload));
        return res.status(200).json({
            message:"Successfully published the message"
        });
    }
    async create(req,res){
    try{
        const response=await bookingService.createBooking(req.body);
        return res.status(StatusCodes.OK).json({
            message:"Successfully created booking",
            success:true,
            err:{},
            data:response
        });

    }catch(error){
        return res.status(error.StatusCodes).json({
            message:error.message,
            success:false,
            err:error.explanation,
            data:{}
        });
         
    }
}

}
module.exports={
    BookingController
}

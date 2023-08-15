const { Booking }=require('../models/index');
const { ValidationError,AppError }=require('../utils/errors/index');
const {StatusCodes}=require('http-status-codes');

class BookinRepository{
  async create(data){
    try{
        const booking=await Booking.create(data);
        return booking;
    }catch(error){
        if(error.name=='SequelizeValidationError'){
            throw new ValidationError(error);
        }
        throw new AppError(
            'Repository Error',
            'Cannot create Booking',
            'There was some issue creating the booking,please try again later',
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
  }

  async update(bookingId,data){
   /* try{
      await Booking.update(data,{
        where:{
          id:bookingId
        }
      });
      return true; */
      try{
        const booking=await Booking.findByPk(bookingId);
        if(data.status){
          Booking.status=data.status;
        }
        await Booking.save();
        return booking;
      
      }catch(error){
      throw new AppError(
        'Repository Error',
        'Cannot update Booking',
        'There was some issue updating the booking,please try again later',
        StatusCodes.INTERNAL_SERVER_ERROR
    );
    }
  }

}

module.exports=BookinRepository;
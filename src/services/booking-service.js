const {BookingRepository}=require('../repository/index');
const axios=require('axios');
const {FLIGHT_SERVICE_PATH}=require('../config/serverconfig');
const { ServiceError } = require('../utils/errors');
//const{createChannel,publishMessage}=require('../utils/message-queues');
class BookingService{
      constructor(){
        this.bookingRepository=new BookingRepository();
      }

      async createBooking(data){           //data-> flightId,userId,noOfSeats
              const flightId=data.flightId;
              try{
                let getFlightUrl=`${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`
                const response=await axios.get(getFlightUrl);
                const flightData=response.data.data;
                let priceOfFlight=flightData.price;
                if(data.noOfSeats>flightData.totalSeats){
                    throw new ServiceError('Something went wrong in booking layer','Insufficient seats available')
                }
                const totalCost=priceOfFlight*data.noOfSeats;
                const bookingPay={...data,totalCost};
                const booking=await this.bookingRepository.create(bookingPay);
                const updateFlightUrl=`${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`;
                axios.patch(updateFlightUrl,{totalSeats:flightData.totalSeats-booking.noOfSeats});
                const finalBooking=await this.bookingRepository.update(booking.id,{status:"Booked"});
                return finalBooking;

              }catch(error){
                if(error.name=='RepositoryError' || error.name=='ValidationError'){
                    throw error;
                }
                 throw new ServiceError();
              }
      }
}

module.exports=BookingService;
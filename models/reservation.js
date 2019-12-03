const mongoose=require('mongoose');


const reservationSchema=new mongoose.Schema({
    name:String,
    people:Number,
    date:String,
    time:String 
});


module.exports=mongoose.model('reservation',reservationSchema);
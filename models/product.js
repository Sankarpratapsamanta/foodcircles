const mongoose=require('mongoose');

const productSchema=new mongoose.Schema({
    title:String,
    photo:String,
    rating:String,
    photoId:String,
    price:Number,
    description:String

});
module.exports=mongoose.model('product',productSchema);
const mongoose=require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose');

const UserSchema=new mongoose.Schema({
    username:{type:String,required:true,unique:true},
    password:{type:String},
    email:{type: String,index:true, required: true, unique: true,uniqueCaseInsensitive: true },
    birthday:{type:String,required:true},
    photo:String,
    photoId:String,
    adminCode:{type:Boolean,default:false},
});

UserSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model('user',UserSchema);
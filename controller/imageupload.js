const express=require('express');
const multer=require('multer');
const cloudinary = require('cloudinary').v2;




    const storage=multer.diskStorage({
        filename:function(req,file,cb){
            cb(null,+ Date.now() + file.originalname);
        }
    });
    
    const upload=multer({
        storage:storage,
        limits:{fileSize:1000000},
        fileFilter:function(req,file,cb){
            if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)){
                cb("error");
            }
            cb(null,true);
        }
    })
    
    cloudinary.config({
        cloud_name:process.env.CLOUDNAME,
        api_key:process.env.CLOUDAPIKEY,
        api_secret:process.env.CLOUDSECRETKEY
    });

exports.image=upload.single('photo'),cloudinary;
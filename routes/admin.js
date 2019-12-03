const express=require('express');
const router=express.Router();
const middleware=require('../middlewares/authenticate');
const user=require('../models/user');
const product=require('../models/product');
const reserve=require('../models/reservation');
const photo=require('../controller/imageupload');
const cloudinary = require('cloudinary').v2;


router.get('/foodcircles/admin',middleware.islogged,async(req,res)=>{
    try{   
        user.find({}).then((user)=>{
            product.find({}).then((product)=>{
                reserve.find({}).then((reserve)=>{
                    res.render('admin/admin',{user:user,product:product,reservation:reserve});
                }).catch((err)=>{
                    req.flash('error','there is no user');
                    res.redirect('back');
                })   
            })
        });
    }catch(err){
        req.flash('error','Somethings wents wrong !');
        res.redirect('back');
    }
});



router.get('/foodcircles/admin/addproduct',middleware.islogged,(req,res)=>{
    res.render('admin/product');
});

router.post('/foodcircles/admin/addproduct',(req,res)=>{
    photo.image(req,res,async(err)=>{
        if(err){
            req.flash('error',err.message);
            return res.redirect('back')
        }
        try{
            let result=await cloudinary.uploader.upload(req.file.path);
            const photo=result.secure_url;
            const photoId=result.public_id;
            const newproduct=await({title:req.body.title,photo:photo,photoId:photoId,rating:req.body.rating,price:req.body.price,description:req.body.description});
            product.create(newproduct).then((newproduct)=>{
                req.flash('success','your product is successfully posted !');
                return res.redirect('/foodcircles/admin');
            }).catch((err)=>{
                req.flash('error',err.message);
                return res.redirect('back');
            });
        }catch(err){
            req.flash('error','Somethings wents wrong !');
            return res.redirect('back');
        }
    })
});


router.get('/foodcircles/admin/product/:id',middleware.islogged,(req,res)=>{
    product.findById(req.params.id).then((product)=>{
        res.render('admin/editproduct',{oneproduct:product});
    }).catch(err=>{
        console.log(err);
        req.flash('error','somehting wents wrong !')
        res.redirect('back');
    });
});

router.put('/foodcircles/admin/product/:id',middleware.islogged,(req,res)=>{
    photo.image(req,res,async(err)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }
        try{
            let oneproduct=await product.findById(req.params.id)
            if(req.file){
                await cloudinary.uploader.destroy(oneproduct.photoId);
                let result=await cloudinary.uploader.upload(req.file.path);
                oneproduct.photo=result.secure_url;
                oneproduct.photoId=result.public_id;
            }
            oneproduct.title=req.body.title;
            oneproduct.price=req.body.price;
            oneproduct.rating=req.body.rating;
            oneproduct.description=req.body.description;
            oneproduct.save();
            req.flash('success','You successfully update your product');
            res.redirect('/foodcircles/admin');
        }catch(err){
            console.log(err);
            req.flash('error',err.message);
            res.redirect('back');
        }
    })
});



router.delete('/foodcircles/admin/product/:id',middleware.islogged,async(req,res)=>{
    try{
        let deleteone=await product.findById(req.params.id);
        await cloudinary.uploader.destroy(deleteone.photoId);
        deleteone.remove();
        req.flash('success','successfully deleted the product !');
        res.redirect("back");
    }catch(err){
        req.flash("error",err.message);
        res.redirect("back");
        return;
    }
})

module.exports=router;
const express=require('express');
const router=express.Router();
const product=require('../models/product');
const middleware=require('../middlewares/authenticate');
const user=require('../models/user');


router.get('/',(req,res)=>{
    res.redirect('/login');
});


router.get('/foodcircles',middleware.islogged,(req,res)=>{
    res.render('home');
 })

router.get('/foodcircles/menu',middleware.islogged,(req,res)=>{
    let noMatch=null;
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        product.find({title:regex}).then((product)=>{
            if(product.length < 1) {
                noMatch = "No result found, please try again !";
            }
            res.render('menu',{product:product,noMatch:noMatch});
        }).catch((err)=>{
            req.flash('error',err.message);
        })
    }else{
        product.find({}).then((product)=>{
            res.render('menu',{product:product,noMatch:noMatch});
        }).catch((err)=>{
            req.flash('error',err.message);
            res.redirect('back');
        })
    }
});
router.get('/foodcircles/gallery',middleware.islogged,(req,res)=>{
    res.render('gallery');
});
router.get('/foodcircles/reservation',middleware.islogged,(req,res)=>{
    res.render('reservation');
});
router.get('/foodcircles/about',middleware.islogged,(req,res)=>{
    res.render('about');
});
router.get('/foodcircles/contact',middleware.islogged,(req,res)=>{
    res.render('contact');
});


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
module.exports=router;
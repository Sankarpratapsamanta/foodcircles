const express=require('express');
const router=express.Router();
const passport=require('passport');
const User=require('../models/user');
const photo=require('../controller/imageupload');
const cloudinary = require('cloudinary').v2;
const middleware=require('../middlewares/authenticate');


router.get('/signup',(req,res)=>{
    res.render('authentication/signup');
   
});

router.post('/signup',(req,res)=>{
    photo.image(req,res,async(err)=>{
        if(err){
            req.flash("error",err.message);
            console.log(err);
        }
        try{
            let result=await cloudinary.uploader.upload(req.file.path);
            const photo=result.secure_url;
            const photoId=result.public_id;
            const newuser=new User({username:req.body.username,photo:photo,photoId:photoId,email:req.body.email,birthday:req.body.birthday});
            if(req.body.adminCode===process.env.ADMINCODE){
                newuser.adminCode=true;
            }            
            if(await User.findOne({email:newuser.email})){
                throw new Error('Email is already taken');
            }
            await User.register(newuser,req.body.password);
            try{
                newuser.save();
                req.flash("success","You successfully registered your account");
                res.redirect("/login");
            }catch(err){
                req.flash("error",err.message);
                res.redirect("back");
            }
        }catch(err){
            req.flash('error',err.message);
            return res.redirect('back');
            
        }
   
    })
});

router.get('/foodcircles/user/:id',(req,res)=>{
    User.findById(req.params.id).then((user)=>{
        res.render('user/useredit',{oneuser:user});
    }).catch(err=>{
        console.log(err);
        req.flash('error','somehting wents wrong !')
        res.redirect('back');
    });
    
});

router.put('/foodcircles/user/:id',middleware.islogged,(req,res)=>{
    photo.image(req,res,async(err)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }
        try{
            let user=await User.findById(req.params.id)
            if(req.file){
                await cloudinary.uploader.destroy(user.photoId);
                let result=await cloudinary.uploader.upload(req.file.path);
                user.photo=result.secure_url;
                user.photoId=result.public_id;
            }
            user.username=req.body.username;
            user.email=req.body.email;
            user.birthday=req.body.birthday;
            user.save();
            req.flash('success','You successfully update your profile');
            res.redirect('/login');

        }catch(err){
            console.log(err);
            req.flash('error',err.message);
            res.redirect('back');
        }
    })
});

router.delete('/foodcircles/:id',middleware.islogged,async(req,res)=>{
    try{
        let user=await User.findById(req.params.id);
        await cloudinary.uploader.destroy(user.photoId);
        user.remove();
        req.flash('success','successfully deleted the account !');
        res.redirect("back");
    }catch(err){
        req.flash("error",err.message);
        res.redirect("back");
        return;
    }
    
});

router.get('/login',(req,res)=>{
    res.render('authentication/login');
});

router.post('/login',
  passport.authenticate('local', {
    successFlash: 'Welcome!',
    successRedirect: '/foodcircles',
    failureRedirect: '/login',
    failureFlash: true })
);


router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success','You successfully logged out !')
    res.redirect('/login');

})

router.get('/forgot',(req,res)=>{
    res.render('authentication/forgot');
})

router.post('/forgot',(req,res)=>{
    User.findByUsername(req.body.username).then(function(sanitizedUser){
        if (sanitizedUser){
            sanitizedUser.setPassword(req.body.password, function(){
                sanitizedUser.save();
                req.flash("success","your password is successfully changed ! ");
                res.redirect("/login")
            });
        } else {
          req.flash("error","This user does not exist !");
          res.redirect("back");
        }
    },function(err){
        res.redirect("back");
    })
})


module.exports=router;
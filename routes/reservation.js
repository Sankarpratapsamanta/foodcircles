const express=require('express');
const router=express.Router();
const reserve=require('../models/reservation');
const middleware=require('../middlewares/authenticate');

router.post('/reservation',middleware.islogged,(req,res)=>{
    const person={name:req.body.name,people:req.body.people,date:req.body.date,time:req.body.time}
        reserve.create(person).then((reserve)=>{
            reserve.save();
            req.flash('success','you successfully booked a table !');
            res.redirect('/foodcircles');
        }).catch(err=>{
            req.flash('error',err.message);
            res.redirect('back');
        })
   
});



module.exports=router
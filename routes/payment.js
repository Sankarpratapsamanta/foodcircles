const express=require('express');
const router=express.Router();
const user=require('../models/user');
const product=require('../models/product');
const middleware=require('../middlewares/authenticate');
const stripe = require('stripe')(process.env.STRIPESECRETKEY);

router.get('/foodcircles/menu/:id',middleware.islogged,async(req,res)=>{
     product.findById(req.params.id).then((product)=>{
     res.render('payment/paymentfile',{payment:product});
    }).catch((err)=>{
        console.log(err);
        req.flash('error','something wents wrong !')
        res.redirect('back');
    })    
});

router.post("/foodcircles/menu",middleware.islogged, (req, res) => {
    try {
      stripe.customers
        .create({
          name: req.body.name,
          phone:req.body.phone,
          email: req.user.email,
          description:req.body.description,
          source: req.body.stripeToken
        })
        .then(customer =>
          stripe.charges.create({
            amount: req.body.amount * 100 .toFixed(2),
            description:req.body.description,
            currency: "inr",
            customer: customer.id
          })
        )
        .then(charges =>{
          req.flash('success','your order is placed should be delivery soon !')
          res.redirect('/foodcircles/menu');
        }).catch(err =>{
          req.flash('error',err.message);
          console.log(err);
          res.redirect('back');
        });
    } catch (err) {
      req.flash('error',err.message);
      console.log(err);
      res.redirect('back');
    }
  });

module.exports=router;

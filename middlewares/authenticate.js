const user=require('../models/user');
const middlewareObj={};

middlewareObj.islogged=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash('error','You must be login to do that !');
        res.redirect('/login');
    }
}

module.exports=middlewareObj;
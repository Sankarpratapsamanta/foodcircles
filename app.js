require('dotenv').config()
const express=require('express');
const app=express();
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const passport=require('passport');
const session = require('express-session');
const passportLocalMongoose=require('passport-local-mongoose');
const LocalStrategy=require('passport-local');
const multer=require('multer');
const methodOverride=require('method-override');
const flash=require('connect-flash');
const User=require('./models/user');
const product=require('./models/product');
const reserve=require('./models/reservation');

const indexRoutes=require('./routes/index');
const userRoutes=require('./routes/user');
const adminRoutes=require('./routes/admin');
const paymentRoutes=require('./routes/payment');
const reserveRoutes=require('./routes/reservation');

mongoose.connect(process.env.DATABASE,{useNewUrlParser: true,useUnifiedTopology: true}).then(()=>{
    console.log('database connected');
}).catch(err=>{
    console.log('db error',err)
})


app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(flash());
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    // cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.use(new LocalStrategy(User.authenticate()));
passport.deserializeUser(User.deserializeUser());
app.use(methodOverride('_method'));

app.use((req,res,next)=>{
    res.locals.currentuser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})



app.use(indexRoutes);
app.use(userRoutes);
app.use(adminRoutes);
app.use(paymentRoutes);
app.use(reserveRoutes);

app.all('*',(req,res)=>{
    res.status(404).send('we are not found your page please try Again !');
    // res.send('hello');
})





let PORT=3000 || process.env.PORT

app.listen(PORT,()=> console.log('server started'));
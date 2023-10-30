var express = require('express');
const mongoose  = require('mongoose');
var app = express();
const port = 5000
app.use(express.urlencoded({extended:true}))
const registerRouter = require('./src/routes/registerRouter');
const loginRouter= require('./src/routes/loginRouter');
const trainerRouter= require('./src/routes/trainerRouter');
// const dietRouter= require('./src/routes/dietRouter');
// const classRouter= require('./src/routes/classRouter');
// const productRouter= require('./src/routes/productRouter');
const adminRouter= require('./src/routes/adminRouter');

const bodyParser = require('body-parser');
const userRouter = require('./src/routes/userRouter');
const bookRouter = require('./src/routes/bookRouter');
const ProductbookRouter = require('./src/routes/ProductbookRouter');


app.use(bodyParser())
app.use(express.urlencoded({extended:true}))
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader( 
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});




app.use('/',registerRouter)
app.use('/log',loginRouter)
app.use('/trainer',trainerRouter)
// app.use('/diet',dietRouter)
// app.use('/class',classRouter)
// app.use('/product',productRouter)
app.use('/admin',adminRouter)
app.use('/user',userRouter)
app.use('/book',bookRouter)
app.use('/productbook',ProductbookRouter)
// app.use('/addtrainer',adminRouter)
// app.use('/trainerdetails',adminRouter)




mongoose.connect('mongodb+srv://vssajanavs:vssajanavs@cluster0.w4nsh9i.mongodb.net/serverDb?retryWrites=true&w=majority').then(()=>{
app.listen(5000,()=>{
    console.log("server started at http://localhost:5000");
});
}).catch((error)=>{
    console.log(error);
})
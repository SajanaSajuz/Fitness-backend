const mongoose  = require("mongoose");   //connecting mongoose db to a const
const schema = mongoose.Schema          // schema to create and structure
const productSchema = new schema({  
    Productname:{type:String,required:true}, 
    Price:{type:Number,required:true}, 
    Image:{type:String,required:true}, 
    Description:{type:String,required:true}, 
})

const productModel = mongoose.model('product_tb',productSchema) //adding the structure and value to a table book_tb
module.exports = productModel
const mongoose = require("mongoose");                                 //connect to db
const schema = mongoose.Schema                                        //create the structure
const regSchema = new schema({                                       //adding new variable to store datas
    Login_id: { type: schema.Types.ObjectId,ref:"log_tb"},        //foreign key
    Name: { type: String, required: true },
    Address: { type: String, required: true },                                      //fields and types
    Phone: { type: String, required: true },
    Email: { type: String, required: true },
    Gender: { type: String, required: true }, 
})                                                                 //added datas into a new variable
const regModel = mongoose.model('reg_tb',regSchema)            // created a table in db
module.exports = regModel
    
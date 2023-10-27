const mongoose = require("mongoose");                                 //connect to db
const schema = mongoose.Schema                                        //create the structure
const logSchema = new schema({                                      //adding new variable to store datas
    Username: { type: String, required: true},
    Password: { type: String, required: true},                                      //fields and types
    Role: { type: String, required: true},                                      //fields and types
    
})                                                                 //added datas into a new variable
const logModel = mongoose.model("log_tb", logSchema)            // created a table in db
module.exports = logModel
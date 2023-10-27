const mongoose = require("mongoose");                                 //connect to db
const schema = mongoose.Schema                                        //create the structure
const classSchema = new schema({
    Classname: { type: String, required: true },
    Classdetails: { type: String, required: true },
    Startdate: { type: String, required: true },
    Enddate: { type: String, required: true },
    Classtime: { type: String, required: true },

})
const classModel = mongoose.model('class_tb', classSchema)            // created a table in db
module.exports = classModel
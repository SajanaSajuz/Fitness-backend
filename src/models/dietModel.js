const mongoose = require("mongoose");                                 //connect to db
const schema = mongoose.Schema                                        //create the structure
const dietSchema = new schema({

    DietName: { type: String, required: true },
    Type_of_program: {type: String, required: true},
    Current_weight: { type: String, required: true },                                      //fields and types
    Goal_weight: { type: String, required: true },
    Foods_include: { type: String, required: true },
    Food_restricted: { type: String, required: true },
    Duration: { type: String, required: true },
    Image: { type: String, required: true },

})
const dietModel = mongoose.model('diet_tb',dietSchema)            // created a table in db
module.exports = dietModel
const mongoose = require("mongoose"); //connect to db
const schema = mongoose.Schema; //create the structure
const bookSchema = new schema({
  user_id: { type: schema.Types.ObjectId, ref:"reg_tb" },
  trainer_id: { type: schema.Types.ObjectId, ref:"trainer_tb" },
  status:{ type: String, required: true}, 
});
const bookModel = mongoose.model("book_tb",bookSchema); // created a table in db
module.exports = bookModel;

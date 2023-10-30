const mongoose = require("mongoose"); //connect to db
const schema = mongoose.Schema; //create the structure
const bookSchema = new schema({
  user_id: { type: schema.Types.ObjectId, ref:"reg_tb" },
  product_id: { type: schema.Types.ObjectId, ref:"product_tb" },
  status:{ type: String, required: true}, 
  quantity:{ type: Number, required: true}, 
});
const ProductbookModel = mongoose.model("productbook_tb",bookSchema); // created a table in db
module.exports = ProductbookModel;
var express = require("express");
const checkAuth = require("../../Middlewares/checkAuth");
const ProductbookModel = require("../models/ProductbookModel");
const mongoose  = require("mongoose");
const ProductbookRouter = express.Router();
ProductbookRouter.post("/cart", checkAuth, async (req, res) => {
  try {
    const bookingdata = {
      user_id: req.userData.userId,
      product_id: req.body.product_id,
      status: 0,
      quantity:1,
    };
    
    const result = await ProductbookModel(bookingdata).save();
    if (result) {
      res.status(201).json({
        success: true,
        error: false,
        message: "Your booking is requested",
        details: result,
      });
    }
    console.log(result);
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        error: true,
        message: "Appointment not completed",
      });
    console.log(error);
  }
});



ProductbookRouter.get("/viewcart/",checkAuth, async (req, res) => {
  try {
    const bookingdata = {
      user_id: req.userData.userId,
      status: 0,
      quantity:1,
    };
    const data = await ProductbookModel.aggregate([
      
  {
    '$lookup': {
      from: 'product_tbs', 
      localField: 'product_id', 
      foreignField: '_id', 
      as: 'productbook',
    }
  },

      {
        $unwind: "$productbook",
      },
      {
        $match: {
          user_id: new mongoose.Types.ObjectId(req.userData.userId)
        },
      },

      {
        $group: {
          _id: "$_id",
          user_id:{$first:"$user_id"},  
          Productname: { $first: "$productbook.Productname" },
          Image: { $first: "$productbook.Image"},
          Price: { $first: "$productbook.Price"},
          quantity: { $first:"$quantity"},
          user_id: { $first:"$user_id"},
          
         
        },
      },
    ]);
    console.log(bookingdata);

    //adding cart amount
    let total=0
    for(i=0;i<data.length;i++){
      console.log(data[i].quantity*data[i].Price);
      total += data[i].quantity*data[i].Price
      console.log(total);
    
    }
   




    if (data[0]) {
      return res
        .status(200)
        .json({ success: true, error: false,Total_amount:total, productbook_details: data, });
    } else {
      return res
        .status(400)
        .json({ success: false, error: true, message: "No data found" });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, error: true, message: "something went wrong" });
  }
});
module.exports = ProductbookRouter;
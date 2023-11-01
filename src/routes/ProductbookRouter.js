var express = require("express");
const checkAuth = require("../../Middlewares/checkAuth");
const ProductbookModel = require("../models/ProductbookModel");
const mongoose = require("mongoose");
const productModel = require("../models/productModel");
const ProductbookRouter = express.Router();
ProductbookRouter.post("/cart", checkAuth, async (req, res) => {
  try {
    const bookingdata = {
      user_id: req.userData.userId,
      product_id: req.body.product_id,
      status: 0,
      quantity: 1,
    };
    const bookedproduct = await ProductbookModel.findOne({
      product_id: req.body.product_id,
      user_id: req.userData.userId,
      status: 0,
    });
    console.log(bookedproduct);
    if (bookedproduct) {
    
      res.status(400).json({
        success: false,
        error: true,
        message: "Data already added to cart",
        details: updateddata,
      });
    } else {
      const result = await ProductbookModel(bookingdata).save();

      res.status(201).json({
        success: true,
        error: false,
        message: "Your booking is added to cart",
        details: result,
      });
    }
    console.log(result);
  } catch (error) {
    console.log(error);
  }
});

ProductbookRouter.get("/viewcart/", checkAuth, async (req, res) => {
  try {
    const bookingdata = {
      user_id: req.userData.userId,
      status: 0,
      quantity: 1,
    };
    const data = await ProductbookModel.aggregate([
      {
        $lookup: {
          from: "product_tbs",
          localField: "product_id",
          foreignField: "_id",
          as: "productbook",
        },
      },

      {
        $unwind: "$productbook",
      },
      {
        $match: {
          user_id: new mongoose.Types.ObjectId(req.userData.userId),
        },
      },

      {
        $group: {
          _id: "$_id",
          user_id: { $first: "$user_id" },
          Productname: { $first: "$productbook.Productname" },
          Image: { $first: "$productbook.Image" },
          Price: { $first: "$productbook.Price" },
          quantity: { $first: "$quantity" },
          user_id: { $first: "$user_id" },
        },
      },
    ]);
    console.log(bookingdata);

    //adding cart amount
    let total = 0;
    for (i = 0; i < data.length; i++) {
      singleprice = data[i].quantity * data[i].Price;
      data[i].singleamount=singleprice
      total = total + singleprice;
      console.log(total);
    }
    if (data[0]) {
      return res.status(200).json({
        success: true,
        error: false,
        Total_amount: total,
        single_amount:singleprice,
        productbook_details: data,
      });
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

ProductbookRouter.get("/increment/:regid", async (req, res) => {
  try {
    cartid = req.params.regid;
    cartdata = await ProductbookModel.findOne({ _id: cartid });
    const data = {
      quantity: cartdata.quantity + 1,
    };
    console.log(data);
    const datas = await ProductbookModel.updateOne(
      { _id: cartid },
      { $set: data }
    );
    if (datas.modifiedCount == 1) {
      return res.status(200).json({
        success: true,
        error: false,
        message: "quantity increased",
        result: datas,
      });
    } else {
      return res
        .status(400)
        .json({ succes: false, error: true, message: "failed to increase" });
    }
  } catch (error) {}
});

ProductbookRouter.get("/decrement/:regid", async (req, res) => {
  try {
    const cartid = req.params.regid;
    const cartdata = await ProductbookModel.findOne({ _id: cartid });
    const data = {
      quantity: cartdata.quantity - 1,
    };
    console.log(data);

    const datas = await ProductbookModel.updateOne(
      { _id: cartid },
      { $set: data }
    );

    if (datas.modifiedCount == 1) {
      return res.status(200).json({
        success: true,
        error: false,
        message: "Quantity is decreased",
        result: datas,
      });
    } else {
      return res
        .status(400)
        .json({ success: false, error: true, message: "Failed to decrease" });
    }
  } catch (error) {}
});
module.exports = ProductbookRouter;

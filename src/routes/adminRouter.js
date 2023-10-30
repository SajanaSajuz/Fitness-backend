var express = require("express");
const adminRouter = express.Router();
const adminModel = require("../models/adminModel");
const mongoose = require("mongoose");
const trainerModel = require("../models/trainerModel");
const productModel = require("../models/productModel");
const userRouter = require("./userRouter");
const logModel = require("../models/logModel");
const bookModel = require("../models/bookModel");

const bcrypt = require("bcryptjs");
//to reg the trainer
// adminRouter.post( "/regtrainer", async (req, res) => {
//     try {

//         const oldUser = await logModel.findOne({ Username: req.body.Username });
//         if (oldUser) {
//             return res.status(400).json({ success: false, error: true, message: "Trainer already exists" });
//         }
//         // // const hashedPassword = await bcrypt.hash(req.body.password, 12);
//         //  const oldPhone = await adminModel.findOne({ Phone:req.body.Phone });
//         // if (oldPhone) {
//         //     return res.status(400).json({ success: false, error: true, message: "Phone number already exists" });
//         //  }
//             let log = {Username: req.body.Username, Password: req.body.Password, Role: 3 }
//             const result = await logModel(log).save()

//             let reg = { TrainerName: req.body.TrainerName, Image: req.body.Image, Address: req.body.Address, Phone: req.body.Phone, Email: req.body.Email, Gender: req.body.Gender , Class:req.body.Class ,Classdetails:req.body.Classdetails }

//             const result2 = await trainerModel(reg).save()
//     if (result2) {
//         res.status(201).json({ success: true, error: false, message: "Registration completed", details: result });
//     }

// } catch (error) {
//     res.status(500).json({ success: false, error: true, message: "Something went wrong" });
//     console.log(error);
// }

// });

adminRouter.get("/view-book-requests", async (req, res) => {
  try {
    const bookeddata = await bookModel.aggregate([
      {
        $lookup: {
          from: "trainer_tbs",
          localField: "trainer_id",
          foreignField: "Login_id",
          as: "adminview",
        },
      },

      {
        $lookup: {
          from: "reg_tbs",
          localField: "user_id",
          foreignField: "Login_id",
          as: "adminuserview",
        },
      },
      {
        $unwind: "$adminview",
      },
      {
        $unwind: "$adminuserview",
      },
      {
        $group: {
          _id: "$_id",
          status: { $first: "$status" },
          TrainerName: { $first: "$adminview.TrainerName" },
          Phone: { $first: "$adminview.Phone" },
          Class: { $first: "$adminview.Class" },
          Name: { $first: "$adminuserview.Name" },
        },
      },
    ]);
    console.log(bookeddata);
    if (bookeddata) {
      return res
        .status(200)
        .json({
          success: true,
          error: false,
          message: "data needs to approved",
          adminview_details: bookeddata,
        });
    } else {
      return res
        .status(400)
        .json({ success: false, error: true, message: "Not yet confirmed" });
    }
  } catch (error) {}
});

adminRouter.get("/accept/:id", async (req, res) => {
  try {
    const bookid = req.params.id;
    const datas = await bookModel.updateOne(
      { _id: bookid },
      { $set: { status: 1 } }
    );

    if (datas.modifiedCount == 1) {
      return res
        .status(200)
        .json({
          success: true,
          error: false,
          message: "Request Accepted",
          result: datas,
        });
    } else {
      return res
        .status(400)
        .json({ success: false, error: true, message: "Something went wrong" });
    }
  } catch (error) {}
});
adminRouter.get("/decline/:id", async (req, res) => {
  try {
    const bookid = req.params.id;
    const datas = await bookModel.updateOne({ _id:bookid },{$set:{status:2}});
console.log(bookid,datas);
    if (datas.modifiedCount== 1) {
      return res
        .status(200)
        .json({
          success: true,
          error: false,
          message: "Request Declined",
          result: datas,
        });
        
    } else {
      return res
        .status(400)
        .json({ success: false, error: true, message: "Something went wrong" });
    }
  } catch (error) {}
});

adminRouter.post("/addtrainer", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.Password, 12);
    console.log(hashedPassword);
    let log = {
      Username: req.body.Username,
      Password: hashedPassword,
      Role: 3,
    };
    const result = await logModel(log).save();
    let reg = {
      TrainerName: req.body.TrainerName,
      Image: req.body.Image,
      Address: req.body.Address,
      Phone: req.body.Phone,
      Email: req.body.Email,
      Gender: req.body.Gender,
      Class: req.body.Class,
      Classdetails: req.body.Classdetails,
    };

    const result2 = await trainerModel(reg).save();
    if (result2) {
      res
        .status(201)
        .json({
          success: true,
          error: false,
          message: "trainer added",
          details: result2,
        });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: true, message: "Something went wrong" });
    console.log(error);
  }
});

//to view all the trainer details

adminRouter.get("/trainerdetails", async (req, res) => {
  try {
    const userdata = await trainerModel.find();
    if (userdata[0]) {
      return res
        .status(200)
        .json({ success: true, error: false, trainer_details: userdata });
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
//to get single details
adminRouter.get("/trainerdetails/:regid", async (req, res) => {
  try {
    const trainerid = req.params.regid;
    const data = await trainerModel.findOne({ _id: trainerid });

    if (data) {
      return res
        .status(200)
        .json({ success: true, error: false, trainer_details: data });
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

// //to update the trainer

adminRouter.post("/update-trainer", async (req, res) => {
  try {
    const trainer_id = req.body.id;
    const data = {
      TrainerName: req.body.TrainerName,
      Phone: req.body.Phone,
      Email: req.body.Email,
      Gender: req.body.Gender,
      Address: req.body.Address,
      Class: req.body.Class,
      Classdetails: req.body.Classdetails,
      Image: req.body.Image,
    };
    console.log(data);
    const datass = await trainerModel.updateOne(
      { id: trainer_id },
      { $set: data }
    ); //to update
    if (datass) {
      return res
        .status(200)
        .json({
          success: true,
          error: false,
          message: "Trainer Edited",
          trainer_details: data,
        });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: true, message: "Something  wrong" });
    console.log(error);
  }
});
//to delete the trainer
adminRouter.get("/trainerdelete/:id", async (req, res) => {
  try {
    const deleteData = await trainerModel.deleteOne({
      _id: req.params.trainerid,
    });
    if (deleteData) {
      res
        .status(201)
        .json({ success: true, error: false, message: "trainer deleted" });
    } else {
      res
        .status(500)
        .json({ success: false, error: true, message: "Failed to delete" });
    }
  } catch (error) {}
});

//to add the products
adminRouter.post("/addproduct", async (req, res) => {
  try {
    let product = {
      Productname: req.body.Productname,
      Price: req.body.Price,
      Description: req.body.Description,
      Image: req.body.Image,
    };
    const result = await productModel(product).save();
    console.log(product);
    if (result) {
      res
        .status(201)
        .json({
          success: true,
          error: false,
          message: "Product Added",
          details: result,
        });
    }
    console.log(result);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: true, message: "Failed to add product" });
    console.log(error);
  }
});
//to view product
adminRouter.get("/productdetails", async (req, res) => {
  try {
    const userdata = await productModel.find();
    if (userdata[0]) {
      return res
        .status(200)
        .json({ success: true, error: false, product_details: userdata });
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

// adminRouter.post("/update-product", async (req, res) => {

//     try {
//       const trainer_id = req.body._id;
//       const data = {
//         TrainerName: req.body.TrainerName,
//         Phone: req.body.Phone,
//         Email: req.body.Email,
//         Gender: req.body.Gender,
//         Address: req.body.Address,
//         Class: req.body.Class,
//         Classdetails: req.body.Classdetails,
//         Image: req.body.Image,
//       };
//       console.log(data);
//       const datass = await trainerModel.updateOne({ _id: trainer_id , },{$set:data});   //to update
//       if(datass.modifiedCount==1){
//         return res.status(200).json({success:true,error:false,message:"Trainer Edited"});
//       }

//     } catch (error) {
//         res.status(500).json({ success: false, error: true, message: "Something  wrong" });
//         console.log(error);
//     }
//   });

//single view
adminRouter.get("/productdetails/:regid", async (req, res) => {
  try {
    const productid = req.params.regid;
    const data = await productModel.findOne({ _id: productid });

    if (data) {
      return res
        .status(200)
        .json({ success: true, error: false, product_details: data });
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

adminRouter.get("/productdelete/:id", async (req, res) => {
  try {
    const deleteData = await productModel.deleteOne({
      _id: req.params.productid,
    });
    if (deleteData) {
      res
        .status(201)
        .json({ success: true, error: false, message: "product deleted" });
    } else {
      res
        .status(500)
        .json({ success: false, error: true, message: "Failed to delete" });
    }
  } catch (error) {}
});

module.exports = adminRouter;

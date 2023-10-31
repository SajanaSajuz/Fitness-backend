var express = require('express');
const userRouter = express.Router()
const mongoose = require('mongoose');
const trainerModel = require('../models/trainerModel');
const productModel = require('../models/productModel');
const classModel = require('../models/classModel');
const checkAuth = require('../../Middlewares/checkAuth');
const bookModel = require('../models/bookModel');





userRouter.get("/bookedstatus",checkAuth, async(req,res)=>{
    try{
      const bookeddata= await bookModel.aggregate([
     {
            '$lookup': {
              'from': 'trainer_tbs', 
              'localField': 'trainer_id', 
              'foreignField': 'Login_id', 
              'as': 'adminview'
            }
            
          },
          
  {
    '$lookup': {
      'from': 'reg_tbs', 
      'localField': 'user_id', 
      'foreignField': 'Login_id', 
      'as': 'adminuserview'
    }
  },
          {
            $unwind: "$adminview",
          },
          {
            $unwind: "$adminuserview",
          },
          {
            $match: {
                user_id: new mongoose.Types.ObjectId(req.userData.userId)
              },
          },
          {
            $group: {
              _id: "$_id", 
              status:{$first:"$status"},
              TrainerName: { $first:"$adminview.TrainerName" },
              Phone: { $first: "$adminview.Phone" },
              Class: { $first: "$adminview.Class" },
              Name: { $first: "$adminuserview.Name" },
            },
          },
         
      ])
      console.log(bookeddata);
      if(bookeddata){
  
        return res.status(200).json({ success: true, error: false, message: "data needs to approved",Userview_details:bookeddata});
      }
      else {
  
        return res.status(400).json({ success: false, error: true, message: "Not yet confirmed" })
    }
    }
    catch(error){
  
    }
  })




userRouter.get("/user-trainerdetails",async(req,res)=>{
    try{
        const userdata= await trainerModel.find();
        if(userdata[0]){
            return res.status(200).json({success:true,error:false,trainer_details:userdata});
        }else{
            return res.status(400).json({success:false,error:true,message:"No data found"});
        }
    }catch(error){
        return res.status(400).json({success:false,error:true,message:"something went wrong"});
    }
});

userRouter.get("/user-productdetails", async (req, res) => {
    try {
        const userdata = await productModel.find();
        if (userdata[0]) {
            return res.status(200).json({ success: true, error: false, product_details: userdata });
        } else {
            return res.status(400).json({ success: false, error: true, message: "No data found" });
        }
    } catch (error) {
        return res.status(400).json({ success: false, error: true, message: "something went wrong" });
    }
});

userRouter.get("/user-classdetails", async (req, res) => {
    try {
        const userdata = await classModel.find();
        if (userdata[0]) {
            return res.status(200).json({ success: true, error: false, class_details: userdata });
        } else {
            return res.status(400).json({ success: false, error: true, message: "No data found" });
        }
    } catch (error) {
        return res.status(400).json({ success: false, error: true, message: "something went wrong" });
    }
});
userRouter.get("/user-productdetails/:regid",async (req, res) => { 

    try{
        const productid =req.params.regid
        console.log(productid);
        const data=await trainerModel.findOne({_id:productid})

        if (data) { 

            return res.status(200).json({ success: true, error: false, product_details: data })

        } else {

            return res.status(400).json({ success: false, error: true, message: "No data found" })
        }

    }catch(error){

        return res.status(400).json({ success: false, error: true, message: "something went wrong" })

    }
})
userRouter.get("/user-trainerdetails/:regid",async (req, res) => { 

    try{
        const trainerid =req.params.regid
        console.log(trainerid);
        const data=await trainerModel.findOne({_id:trainerid})

        if (data) { 

            return res.status(200).json({ success: true, error: false, trainer_details: data })

        } else {

            return res.status(400).json({ success: false, error: true, message: "No data found" })
        }

    }catch(error){

        return res.status(400).json({ success: false, error: true, message: "something went wrong" })

    }
})




module.exports= userRouter
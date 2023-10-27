var express = require('express');
const userRouter = express.Router()
const mongoose = require('mongoose');
const trainerModel = require('../models/trainerModel');
const productModel = require('../models/productModel');
const classModel = require('../models/classModel');
const checkAuth = require('../../Middlewares/checkAuth');


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
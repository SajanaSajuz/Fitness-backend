var express = require('express');
const trainerRouter = express.Router()
const trainerModel = require('../models/trainerModel')
const logModel = require('../models/logModel')
const  mongoose = require('mongoose');
const multer= require('multer');
const classModel = require('../models/classModel');
const checkAuth = require('../../Middlewares/checkAuth');
const bookModel = require('../models/bookModel');
// const checkAuth = require('../../Middlewares/checkAuth');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../my-app/public/Images/')
    },
    filename: function (req, file, cb) {
      
      cb(null,req.body.filename)
    }
  })
  
  const upload = multer({ storage: storage })
  trainerRouter.post('/upload',(req,res)=>{
    return res.json("file uploaded")
  })


//to view booked users from trainers side
  trainerRouter.post("/trainer-user", checkAuth, async (req, res) => {
    try {
      const traineruser = {
        user_id: req.userData.userId,
        trainer_id: req.body.trainer_id,
        status:0,
      };
      const result = await bookModel(traineruser).save();
      if (result) {
        res.status(201).json({
          success: true,
          error: false,
          message: "Your booking is confirmed",
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
  
  trainerRouter.get("/traineruserdetails",checkAuth, async (req, res) => {
    try {
      const bookingdata = {
       
        trainer_id:req.userData.userId,
      };
      console.log(bookingdata);
      const data = await bookModel.aggregate([
        {
          
        $lookup: {
          from: "reg_tbs",
          localField: "user_id",
          foreignField: "Login_id",
          as: "user",
        },
      },
    

      {
        $unwind: "$user",
      },
      {
        $match: {
          trainer_id: new mongoose.Types.ObjectId(req.userData.userId)
        },
      },

      {
        $group: {
          _id: "$_id",
          trainer_id:{$first:"$trainer_id"},  
          Name: { $first: "$user.Name"},
          Phone: { $first: "$user.Phone"},
          Gender: { $first: "$user.Gender"},
        },
      },
    ]);
    console.log(data);
      if (data) {
        return res
          .status(200)
          .json({ success: true, error: false, user_details:data });
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




trainerRouter.post( "/",upload.single("file"), async (req, res) => {
    try {
       
        const oldUser = await logModel.findOne({ Username: req.body.Username });
        if (oldUser) {
            return res.status(400).json({ success: false, error: true, message: "Trainer already exists" });
        }
        // const hashedPassword = await bcrypt.hash(req.body.password, 12);
         const oldPhone = await trainerModel.findOne({ Phone:req.body.Phone });
        if (oldPhone) { 
            return res.status(400).json({ success: false, error: true, message: "Phone number already exists" });
         }
            let log = {Username: req.body.Username, Password: req.body.Password, Role: 3 } 
            const result = await logModel(log).save()
            console.log("hii");
            let reg = { Login_id: result._id, TrainerName: req.body.TrainerName, Image: req.body.Image, Address: req.body.Address, Phone: req.body.Phone, Email: req.body.Email, Gender: req.body.Gender , Class:req.body.Class ,Classdetails:req.body.Classdetails }
            
            const result2 = await trainerModel(reg).save()
    if (result2) {
        res.status(201).json({ success: true, error: false, message: "Trainer Addded", details: result2 });
    }

} catch (error) {
    res.status(500).json({ success: false, error: true, message: "Something went wrong" });
    console.log(error);
}
       
});

trainerRouter.get("/trainerdetails", async(req,res)=>{
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






trainerRouter.post("/update-trainer",upload.single('file'), async (req, res) => {

    try {
      const trainer_id = req.body._id;
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
      const datass = await trainerModel.updateOne({ _id: trainer_id , },{$set:data});   //to update
      if(datass.modifiedCount==1){
        return res.status(200).json({success:true,error:false,message:"Trainer Edited"});
      }
     
    } catch (error) {
        res.status(500).json({ success: false, error: true, message: "Something  wrong" });
        console.log(error);
    }
  });





trainerRouter.get("/trainerdetails/:regid", async (req, res) => { 

    try{
        const trainerid =req.params.regid
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


trainerRouter.post("/addclass", async (req, res) => {
    try {
        let classes = { Classname: req.body.Classname, Classdetails: req.body.Classdetails, Startdate: req.body.Startdate, Enddate: req.body.Enddate,Classtime: req.body.Classtime }
        const result2 = await classModel(classes).save()
        console.log(result2);

        
        if (result2) {
            res.status(201).json({ success: true, error: false, message: "class chart added", details: result2 });
        }

    } catch (error) {
        res.status(500).json({ success: false, error: true, message: "Something went wrong" });
        console.log(error);
    }


});

trainerRouter.get("/classdetails", async (req, res) => {
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




module.exports = trainerRouter;
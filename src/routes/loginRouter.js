var express = require('express');
const loginRouter = express.Router()

const logModel = require('../models/logModel');
const regModel = require('../models/regModel');
const trainerModel = require('../models/trainerModel');
const bcrypt =require('bcryptjs')
const jwt =require("jsonwebtoken")




loginRouter.post( "/", async (req, res) => {
    try {
        const oldUser = await logModel.findOne({ Username: req.body.Username });
       
        if (!oldUser) {
            return res.status(400).json({ success: true, error: false, message: "user doesn't exist" });
        }
        // const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const ispasswordcorrect = await bcrypt.compare(req.body.Password,oldUser.Password)
        
        console.log(req.body.Password);
        console.log(oldUser.Password);
        if (ispasswordcorrect) {
           
            // if(oldUser.Role=='2'){
                // const userDetails = await regModel.findOne({ Login_id: oldUser._id });
                // const loginDetails = {
                //     loginID:oldUser._id,
                //     userID:userDetails._id,
                //     role:oldUser.Role,
                //     name:userDetails.Name
            
                const token = jwt.sign({
                    user_Id:oldUser._id,
                    user_Role:oldUser.Role,
                    user_Name:oldUser.Username
                },
                'secret_key',
                {expiresIn:'1h'})
            
                console.log('token',token);
                return res.status(200).json({
                    success:true,   //json-body ,res.status(200)-statuscode
                    error:false,
                    message:'token generated',
                    token:token,
                    expiresIn:'1h',  //time to expire
                    login_Id:oldUser._id,
                    role:oldUser.Role,
                    user_Name:oldUser.Username,
                })
                
                // return res.status(200).json({ success: true, error: false, message: "login success",details:loginDetails });
            
                // }
            // if(oldUser.Role=='3'){
            //     const userDetails = await trainerModel.findOne({ Login_id: oldUser._id });
            //     const loginDetails = {
            //         loginID:oldUser._id,
                    
            //         trainerID:userDetails._id,
            //         role:oldUser.Role,
            //         trainerName:userDetails.TrainerName
            //     }
            //     return res.status(200).json({ success: true, error: false, message: "login success",details:loginDetails });
            // }
        
        }
        else{
            return res.status(400).json({ success: true, error: false, message: "password not matching" });
        }
            
    }
catch (error) {
    res.status(500).json({ success: true, error: false, message: "something went wrong" });
    console.log(error);
}

   
});


module.exports = loginRouter;
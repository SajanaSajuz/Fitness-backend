var express = require('express');
const registerRouter = express.Router()
const regModel = require('../models/regModel')
const logModel = require('../models/logModel');
const  mongoose = require('mongoose');
const bcrypt = require('bcryptjs')



registerRouter.post("/", async (req, res) => {
    try {

        const oldUser = await logModel.findOne({ Username: req.body.Username });
        console.log(req.body.Password)
        if (oldUser) {
            return res.status(400).json({ success: false, error: true, message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(req.body.Password,8);
        const oldPhone = await regModel.findOne({ Phone: req.body.Phone });
        if (oldPhone) {
            return res.status(400).json({ success: false, error: true, message: "Phone number already exists" });
        }
        let log = { Username: req.body.Username, Password: hashedPassword, Role: 2 }
        const result = await logModel(log).save()
        console.log("hii");
        let reg = { Login_id: result._id, Name: req.body.Name, Address: req.body.Address, Phone: req.body.Phone, Email: req.body.Email, Gender: req.body.Gender, }

        const result2 = await regModel(reg).save()
        console.log(result2);
        if (result2) {
            res.status(200).json({ success: true, error: false, message: "Registration completed", details: result2 });
        }

    } catch (error) {
        res.status(500).json({ success: false, error: true, message: "Something went wrong" });
        console.log(error);
    }

});


//view all users details
// registerRouter.get("/userdetails", async (req, res) => {
//     try {
//         const userdata = await regModel.find();
//         if (userdata[0]) {
//             return res.status(200).json({ success: true, error: false, user_details: userdata });
//         } else {
//             return res.status(400).json({ success: false, error: true, message: "No data found" });
//         }
//     } catch (error) {
//         return res.status(400).json({ success: false, error: true, message: "something went wrong" });
//     }
// });

//view one user details
// registerRouter.get("/userdetails/:regid", async (req, res) => {

//     try {
//         const userid = req.params.regid
//         const data = await regModel.aggregate([
//             {
//                 '$lookup': {
//                     'from': 'log_tbs',
//                     'localField': 'Login_id',
//                     'foreignField': '_id',
//                     'as': 'result'
//                 }
//             },

//             {
//                 '$unwind': '$result' //empty arrays delete;convert arrays to objects
//             },
//             {
//                 '$match': {
//                     '_id': new mongoose.Types.ObjectId(userid) //to get the specific id details
//                 }
//             },
//             {
//                 '$group': {
//                     '_id': '$_id',
//                     'Name': { '$first': '$Name' },
//                     'Address': { '$first': '$Address' },            //to get needed data from different tables
//                     'Username': { '$first': '$result.Username' },
//                 }
//             }
//         ])
//         if (data) {

//             return res.status(200).json({ success: true, error: false, user_details: data })

//         } else {

//             return res.status(400).json({ success: false, error: true, message: "No data found" })
//         }

//     } catch (error) {

//         return res.status(400).json({ success: false, error: true, message: "something went wrong" })

//     }
// })



module.exports = registerRouter;
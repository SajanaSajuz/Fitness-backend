var express = require("express");
const checkAuth = require("../../Middlewares/checkAuth");
const bookModel = require("../models/bookModel");
const mongoose  = require("mongoose");
const bookRouter = express.Router();
bookRouter.post("/booking", checkAuth, async (req, res) => {
  try {
    const bookingdata = {
      user_id: req.userData.userId,
      trainer_id: req.body.trainer_id,
      status: 0,
    };
    const result = await bookModel(bookingdata).save();
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

// bookRouter.get("/trainerdetails/:regid", async (req, res) => {
//   try {
//     const trainerid = req.params.regid;
//     const data = await bookModel.aggregate([
//       {
//         $match: {
//           trainer_id: new mongoose.Types.ObjectId(trainerid), //to view details of one given id
//         },
//       },
//     ]);

//     if (data) {
//       return res
//         .status(200)
//         .json({ success: true, error: false, trainer_details: data });
//     } else {
//       return res
//         .status(400)
//         .json({ success: false, error: true, message: "No data found" });
//     }
//   } catch (error) {
//     return res
//       .status(400)
//       .json({ success: false, error: true, message: "something went wrong" });
//   }
// });

bookRouter.get("/viewbook/", checkAuth, async (req, res) => {
  try {
    const bookingdata = {
      user_id: req.userData.userId,
      status: 0,
    };
    const data = await bookModel.aggregate([
      {
        $lookup: {
          from: "trainer_tbs",
          localField: "trainer_id",
          foreignField: "Login_id",
          as: "trainer",
        },
      },

      {
        $unwind: "$trainer",
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
          TrainerName: { $first: "$trainer.TrainerName" },
          Image: { $first: "$trainer.Image"},
          Phone: { $first: "$trainer.Phone" },
          Class: { $first: "$trainer.Class" },
        },
      },
    ]);
    console.log(bookingdata);
    // const userdata= await bookModel.find();
    if (data[0]) {
      return res
        .status(200)
        .json({ success: true, error: false, viewbook_details: data });
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

module.exports = bookRouter;

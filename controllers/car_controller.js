const Cars = require("../model/car");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const carCtrl = {
  createCar :async(req,res)=>{
    try {
      const {code,password,firmware,createdBy}= req.body;
      const newCarCode = code.toLowerCase().replace(/ /g, "");

      const car = await Cars.findOne({ code: newCarCode });
      if (car)
        return res.status(400).json({ msg: "this code already exists" });

      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "password must be atleast 6 characters long" });

      const passwordHash = await bcrypt.hash(password, 13);

      const newCar = new Cars({
        firmware:mongoose.Types.ObjectId(firmware),
        code: newCarCode,
        password: passwordHash,
        createdBy:createdBy
      });

      await newCar.save();
      res.status(200).json({
        msg: "Car added sucessfully",
        car: {
          ...newCar._doc,
          password: "",
        },
      });
    } catch (err) {
      return res.status(500).json({msg:err.message});
    }
  },
  getCarsList: async(req,res)=>{
    try {
      const cars =await  Cars.find().populate("admin users","-password");
      if(!cars){
        return res.status(400).json({msg:"cars not found"})
      }
      return res.status(200).json({msg:"success",cars})
    } catch (err) {
      return res.status(500).json({msg:err.message});
    }
  },
  deleteCar: async(req,res)=>{
    try {
      const {code} = req.body;
      await Cars.deleteOne({code:code});
      res.status(200).json({msg:"car deleted successfully"})

    } catch (err) {
      res.status(500).json({msg:err.message})
    }
  }

}

module.exports = carCtrl;
const Users = require("../model/user");
const Cars = require("../model/car");

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userCtrl = {
  searchUser: async (req, res) => {
    try {
      const users = await Users.find({
        username: { $regex: req.query.username },
      })
        .limit(10)
        .select("fullname username profileImage");

      res.json({ users });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await Users.findOne({ _id: req.params.id }).select(
        "-password"
      );
      if (!user) return res.status(400).json({ msg: "No user Exists" });
      res.json({ user });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateUser: async (req, res) => {
    try {
      const { fullname, profileImage, email } = req.body;
      if (!fullname)
        return res.status(500).json({ msg: "Fullname is requires" });

      const user = await Users.findOneAndUpdate(
        { _id: req.body._id },
        {
          fullname,
          profileImage,
          email,
        }
      );

      res.json({ msg: "update success", user });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getCars: async (req, res) => {
    try {
      const id = req.params.id;
      const myCars = await Cars.find({ admin: mongoose.Types.ObjectId(id) });
      return res.status(200).json({ msg: "sucess", myCars });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getSharedCars: async (req, res) => {
    try {
      const id = req.params.id;
      const mySharedCars = await Cars.find({
        users: mongoose.Types.ObjectId(id),
      });
      return res.status(200).json({ msg: "sucess", mySharedCars });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  shareCar: async (req, res) => {
    try {
      const {myId, userId, carId } = req.body;
      await Cars.updateOne(
        { _id: carId , admin : mongoose.Types.ObjectId(myId)},
        { $push: { users: mongoose.Types.ObjectId(userId) } }
      );
      return res.status(200).json({ msg: "user added successfully and can control" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  unShareCar: async (req, res) => {
    try {
      const {myId, userId, carId } = req.body;
      await Cars.updateOne(
        { _id: carId  ,admin:mongoose.Types.ObjectId(myId)},
        { $pullAll: { users:  mongoose.Types.ObjectId(userId) } }
      );
      return res.status(200).json({ msg: "user removed successfully and can't control rignt now" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  removeSharedCar: async (req, res) => {
    try {
      const {myId, carId } = req.body;
      await Cars.updateOne(
        { _id: carId },
        { $pullAll: { users:  mongoose.Types.ObjectId(myId) } }
      );
      return res.status(200).json({ msg: "you removed successfully and can't control right now" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  addCar: async (req, res) => {
    try {
        const {myId, code , password} = req.body;
        const car = await Cars.findOne({ code });

        if (!car) return res.status(400).json({ msg: "Car does not exists" });
  
        const isMatch = await bcrypt.compare(password, car.password);
        if (!isMatch)
          return res.status(400).json({ msg: "User Passowrd is incorrect" });
        car.overwrite({ admin: mongoose.Types.ObjectId(myId) });
        await car.save();

        const updatedCar = await Cars.findOne({_id :car._id}).populate("admin users","-password");
        res.status(200).json({msg: "added successfully",updatedCar});
        
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  removeCar: async (req, res) => {
    try {
        const {myId, code , password} = req.body;
        const car = await Cars.findOne({ code });

        if (!car) return res.status(400).json({ msg: "Car does not exists" });
  
        const isMatch = await bcrypt.compare(password, car.password);
        if (!isMatch)
          return res.status(400).json({ msg: "User Passowrd is incorrect" });
        car.overwrite({ admin:null });
        await car.save();

        res.status(200).json({msg: "car removed successfully"});
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

};

module.exports = userCtrl;
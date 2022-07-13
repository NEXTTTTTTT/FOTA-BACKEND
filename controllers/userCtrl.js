const Users = require("../model/user");
const Cars = require("../model/car");

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");



const userCtrl = {
  searchUser: async (req, res) => {
    try {
      const users = await Users.find({
        username: { $regex: req.body.username },
      })
        .limit(10)
        .select("fullname username profileImage");

      res.status(200).json({ status: 0, msg: "success", users: users });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUser: async (req, res) => {
    try {
      res.status(200).json({ status: 0, msg: "success", user: user });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateUser: async (req, res) => {
    try {
      const { fullname, profileImage } = req.body;
      if (!fullname)
        return res.status(500).json({ msg: "Fullname is requires" });

      const newUser = await Users.findOneAndUpdate(
        { _id: user._id },
        {
          fullname,
          profileImage,
        }
      );

      res.status(200).json({ status: 0, msg: "update success", user: newUser });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getCars: async (req, res) => {
    try {
      const id = user._id;
      console.log(id);
      const myCars = await Cars.find({
        $or: [
          { admin: mongoose.Types.ObjectId(id) },
          { users: mongoose.Types.ObjectId(id) },
        ],
      }).populate("firmware users admin", "-password");
      return res
        .status(200)
        .json({ status: 0, msg: "sucess", my_cars: myCars });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  shareCar: async (req, res) => {
    try {
      const { userId, carId } = req.body;
      await Cars.updateOne(
        { _id: carId, admin: mongoose.Types.ObjectId(user._id) },
        { $push: { users: mongoose.Types.ObjectId(userId) } }
      );
      return res
        .status(200)
        .json({ status: 0, msg: "user added successfully and can control" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  removeUserAwayMyCar: async (req, res) => {
    try {
      const { userId, carId } = req.body;
      await Cars.updateOne(
        { _id: carId, admin: mongoose.Types.ObjectId(user._id) },
        { $pullAll: { users: mongoose.Types.ObjectId(userId) } }
      );
      return res
        .status(200)
        .json({
          status: 0,
          msg: "user removed successfully and can't control rignt now",
        });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  unshareCar: async (req, res) => {
    try {
      const { carId } = req.body;
      await Cars.updateOne({ _id: carId }, { $pullAll: { users: user._id } });
      return res
        .status(200)
        .json({
          status: 0,
          msg: "you removed successfully and can't control right now",
        });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  connectCar: async (req, res) => {
    try {
      const { code, password } = req.body;
      const car = await Cars.findOne({ code });

      if (!car) return res.status(400).json({ msg: "Car does not exists" });

      const isMatch = await bcrypt.compare(password, car.password);
      if (!isMatch)
        return res.status(400).json({ msg: "User Passowrd is incorrect" });

      await Cars.updateOne({ code: code }, { admin: user._id });
      const updatedCar = await Cars.findOne({ code: code }).populate(
        "admin users",
        "-password"
      );
      res
        .status(200)
        .json({ status: 0, msg: "added successfully", car: updatedCar });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  disconnectCar: async (req, res) => {
    try {
      const { code, password } = req.body;
      const car = await Cars.findOne({ code });

      if (!car) return res.status(400).json({ msg: "Car does not exists" });
      if (car.admin.toString() !== user._id)
        return res.status(400).json({ msg: "You are not admin of this car" });

      const isMatch = await bcrypt.compare(password, car.password);
      if (!isMatch)
        return res.status(400).json({ msg: "User Passowrd is incorrect" });
      await Cars.updateOne({ code: code }, { admin: null });

      res.status(200).json({ status: 0, msg: "car removed successfully" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const users = await Users.find();
      return res.status(200).json({ msg: "success", users });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = userCtrl;

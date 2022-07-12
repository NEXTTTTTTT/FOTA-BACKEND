const Employee = require("../model/employee");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const employeeCtrl = {
  createEmployee :async(req,res)=>{
    try {
      const {fullname,username, password}= req.body;
      const newUsername = username.toLowerCase().replace(/ /g, "");

      const employee = await Employee.findOne({ username: newUsername });
      if (employee)
        return res.status(400).json({ msg: "this employee already exists" });

      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "password must be atleast 6 characters long" });

      const passwordHash = await bcrypt.hash(password, 13);

      const newEmployee = new Employee({
        fullname:fullname,
        username: newUsername,
        password: passwordHash,
        createdBy
      });

      await newEmployee.save();
      res.status(200).json({
        msg: "Employee added sucessfully",
        employee: {
          ...newEmployee._doc,
          password: "",
        },
      });
    } catch (err) {
      return res.status(500).json({msg:err.message});
    }
  },

  editEmployee :async(req,res)=>{
    try {
      const {fullname,username, profileImage, password}= req.body;
      if (password.length < 6)
      return res
        .status(400)
        .json({ msg: "password must be atleast 6 characters long" });

      const passwordHash = await bcrypt.hash(password, 13);
      const employee = await Employee.findOneAndUpdate({ username: username },{
        fullname,profileImage,passwordHash
      });
      
      res.status(200).json({
        msg: "Employee added sucessfully",
        employee: {
          ...employee._doc,
          password: "",
        },
      });
    } catch (err) {
      return res.status(500).json({msg:err.message});
    }
  },
  getEmployees: async(req,res)=>{
    try {
      const employees =await  Employee.find();
      if(!employees){
        return res.status(400).json({msg:"employees not found"})
      }
      return res.status(200).json({msg:"success",employees})
    } catch (err) {
      return res.status(500).json({msg:err.message});
    }
  },
  deleteEmployee: async(req,res)=>{
    try {
      const {username} = req.body;
      await Cars.deleteOne({username:username});
      res.status(200).json({msg:"employee deleted successfully"})

    } catch (err) {
      res.status(500).json({msg:err.message})
    }
  }

}

module.exports = employeeCtrl;
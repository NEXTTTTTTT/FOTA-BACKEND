const Employee = require("../model/employee");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const employee = require("../model/employee");

const employeeCtrl = {
  createEmployee :async(req,res)=>{
    try {
      const {fullname,username, password}= req.body;
      const newUsername = username.toLowerCase().replace(/ /g, "");

      const employee2 = await Employee.findOne({ username: newUsername });
      if (employee2)
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
        // createdBy:employee._id
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
      const {fullname, password}= req.body;
      const profileImage = req.profileImage;

      if (password.length < 6)
      return res
        .status(400)
        .json({ msg: "password must be atleast 6 characters long" });

      const passwordHash = await bcrypt.hash(password, 13);
      const newEmployee = await Employee.findOneAndUpdate({ username: req.employee.username },{
        fullname,profileImage,passwordHash
      });
      
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
      await Employee.deleteOne({username:username});
      res.status(200).json({msg:"employee deleted successfully"})

    } catch (err) {
      res.status(500).json({msg:err.message})
    }
  }

}

module.exports = employeeCtrl;
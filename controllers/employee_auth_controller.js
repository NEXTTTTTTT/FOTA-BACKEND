const Employee = require("../model/employee");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require ("dotenv").config();

const authCtrl = {
  
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      const employee = await Employee.findOne({ username });

      if (!employee) return res.status(400).json({ msg: "Employee does not exists" });

      const isMatch = await bcrypt.compare(password, employee.password);
      if (!isMatch)
        return res.status(400).json({ msg: "User Passowrd is incorrect" });

      const access_token = createAccessToken({ id: employee._id });
      

      
      res.status(200).json({
        "status":0,
        "msg": "login sucess",
        "access_token" : access_token,
        "employee": {
          ...employee._doc,
          password: "",
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESSTOKENSECRET, { expiresIn: "30d" });
};


module.exports = authCtrl;

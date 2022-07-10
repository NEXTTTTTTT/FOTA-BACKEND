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

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ msg: "User Passowrd is incorrect" });

      const access_token = createAccessToken({ id: user._id });
      const refresh_token = createRefreshToken({ id: user._id });

      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/api/refresh_token",
        maxAge: 24 * 30 * 60 * 60 * 1000, //30days
      });

      res.status(200).json({
        "status":0,
        "msg": "login sucess",
        "access_token" : access_token,
        "refresh_token":refresh_token,
        "employee": {
          ...employee._doc,
          password: "",
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/api/refresh_token" });
      res.status(200).json({"status":0, "msg": "Logged out" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  generateAccessToken: async (req, res) => {
    try {
      const rf_token = req.body.refreshtoken;

      if (!rf_token) return res.status(400).json({ msg: "please login now" });

      jwt.verify(
        rf_token,
        process.env.REFRESHTOKENSECRET,
        async (err, result) => {
          if (err) return res.status(401).json({ msg: err.message});

          const employee = await Employee.findById(result.id)
            .select("-password");

          if (!employee)
            return res.status(400).json({ msg: "user does not exist" });

          const access_token = createAccessToken({ id: result.id });

          res.status(201).json({
            "status":0,
            "msg":"success",
            "access_token":access_token,
            "employee":employee,
          });
        }
      );
    } catch (err) {
      return res.status(401).json({ msg: err.message });
    }
  },
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESSTOKENSECRET, { expiresIn: "30d" });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESHTOKENSECRET, {
    expiresIn: "100d",
  });
};
module.exports = authCtrl;

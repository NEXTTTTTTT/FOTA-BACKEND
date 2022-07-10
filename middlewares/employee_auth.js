const Employee = require("../model/employee");
const jwt = require('jsonwebtoken');

const employeeAuth = async (req,res,next) =>{
    try {
        const token = req.header("Authorization")

        if(!token)  return res.status(500).json({msg: "token required"})

        const decoded = jwt.verify(token, process.env.ACCESSTOKENSECRET)
        if(!decoded)  return res.status(401).json({msg: "jwt expired"})
        
        const employee = await Employee.findOne({_id: decoded.id})
       
        req.employee = employee;
        
        next();
        
    } catch (err) {
        return res.status(401).json({msg: "jwt expired"})
    }
}

module.exports = employeeAuth;
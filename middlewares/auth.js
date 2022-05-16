const Users = require("../model/user");
const jwt = require('jsonwebtoken');

const auth = async (req,res,next) =>{
    try {
        const token = req.header("Authorization")

        if(!token)  return res.status(500).json({msg: "auth is required"})

        const decoded = jwt.verify(token, process.env.ACCESSTOKENSECRET)
        if(!decoded)  return res.status(401).json({msg: "Invalid JWT"})
        
        const user = await Users.findOne({_id: decoded.id})
       
        req.user = user;
        
        next();
        
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

module.exports = auth;
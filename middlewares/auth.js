const Users = require("../model/user");
const jwt = require('jsonwebtoken');

const auth = async (req,res,next) =>{
    try {
        const token = req.header("Authorization")

        if(!token)  return res.status(500).json({msg: "token required"})

        const decoded = jwt.verify(token, process.env.ACCESSTOKENSECRET)
        if(!decoded)  return res.status(401).json({msg: "jwt expired"})
        
        const user = await Users.findOne({_id: decoded.id})
       
        req.user = user;
        
        next();
        
    } catch (err) {
        return res.status(401).json({msg: "jwt expired"})
    }
}

module.exports = auth;
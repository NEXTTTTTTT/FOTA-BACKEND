
const jwt = require('jsonwebtoken');

const auth = async (req,res,next) =>{
    try {
        const token = req.header("Authorization")

        if(!token)  return res.status(400).json({msg: "token is required"})

        const decoded = jwt.verify(token, process.env.ACCESSTOKENSECRET)
        if(!decoded)  return res.status(401).json({msg: "Invalid JWT"})
        
        next();
        
    } catch (err) {
        return res.status(401).json({msg: "Invalid JWT"})
    }
}

module.exports = auth;
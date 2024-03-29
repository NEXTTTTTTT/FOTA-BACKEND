const mongoose = require("mongoose");

const UserScheme = mongoose.Schema(
  {
    fullname:{type:String },
    username: { type: String, required: true,trim:true,unique:true ,maxlength:25,},
    password: { type: String, required: true },
    email: { type: String },
    profileImage: { type: String, default: "" },
    deviceToken: { type: String ,default:""},
    isActive: { type: Boolean, default: false },
    currentLocation: {
      type: Map,
      of: String,
      required:false
    },
    color: {type:String , default: "#443477"},
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", UserScheme);

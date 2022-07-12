const mongoose = require("mongoose");

const EmployeeScheme = mongoose.Schema(
  {
    fullname:{type:String },
    username: { type: String, required: true,trim:true,unique:true ,maxlength:25,},
    password: { type: String, required: true },
    profileImage: { type: String, default: "" },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "employee",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("employee", EmployeeScheme);
const mongoose = require("mongoose");

const UserScheme = mongoose.Schema(
  {
    fullname:{type:String },
    username: { type: String, required: true,trim:true,unique:true ,maxlength:25,},
    password: { type: String, required: true },
    email: { type: String },
    profileImage: { type: String, default: "" },
    deviceToken: { type: String },
    isActive: { type: Boolean, default: false },
    currentLocation: {
      type: String,
      required: {
        function() {
          return this.isActive;
        },
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", UserScheme);

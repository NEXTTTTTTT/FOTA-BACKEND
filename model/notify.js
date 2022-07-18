const mongoose = require("mongoose");

const NotifyScheme = mongoose.Schema(
  {
    action:{type:String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    sender: {type:mongoose.Schema.Types.ObjectId,ref:"user"},
    isRead: { type: Boolean, default: false },
    car: { type: mongoose.Schema.Types.ObjectId, ref: "car" },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("notify", NotifyScheme);

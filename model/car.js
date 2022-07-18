const { default: mongoose } = require("mongoose");

const CarScheme = mongoose.Schema(
  {
    temp:{type:Number,default:0},
    code: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    carType: { type: String },
    isActive: { type: Boolean, default: false },
    carLocation: {
      type: String
    },
    admin: { type: mongoose.Types.ObjectId, ref: "user" },
    currentUser: { type: mongoose.Types.ObjectId, ref: "user" },
    users: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    defaultSpeed: { type: Number, default: 120 },
    currentSpeed: {
      type: Number,
      min: [0, `the speed can't be less than zero`],
      default: 0,
    },
    currentFuel: {
      type: Number,
      min: [0, `the fuel can't be less than zero`],
      max:[100,`the fuel can't exceed 100%`],
      default: 0,
    },
    
    firmware: {
      type: mongoose.Types.ObjectId,
      ref: "firmware",
    },

    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "employee",
    },
    isMotorOn:{
      type:Boolean,default:false
    },
    isDoorLocked:{
      type:Boolean,default:true
    },
    isAcOn:{
      type:Boolean,default:false
    },
    isBagOn:{
      type:Boolean,default:false
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("car", CarScheme);

const { default: mongoose } = require("mongoose");

const CarScheme = mongoose.Schema({
  code: { type: String, required: true,trim:true,unique:true },
  password: { type: String, required: true },
  carType: { type: String },
  isActive: { type: Boolean, default: false },
  carLocation: {
    type: String,
    required: {
      function() {
        return this.isActive;
      },
    },
  },
  admin:{type:mongoose.Types.ObjectId,ref:'user'},
  users:[{type:mongoose.Types.ObjectId,ref:'user'}],
  defaultSpeed: { type: Number, default: 120 },
  curentSpeed: {
    type: Number,
    min: [0, `the speed can't be less than zero`],
    default: 0,
  },
  version: {
    type: String,
    required: true,
    lowercase: true,
  },
  createdBy: {
      type: String,
      default: "Adminstrator",
    },
  },{
    timestamps:true
  }
);

module.exports = mongoose.model("car", CarScheme);


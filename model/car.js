const { default: mongoose } = require("mongoose");

const CarScheme = mongoose.Schema(
  {
    code: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    carType: { type: String },
    isActive: { type: Boolean, default: false },
    carLocation: {
      type: Map,of: String
    },
    admin: { type: mongoose.Types.ObjectId, ref: "user" },
    users: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    defaultSpeed: { type: Number, default: 120 },
    currentSpeed: {
      type: Number,
      min: [0, `the speed can't be less than zero`],
      default: 0,
    },
    firmware: {
      type: mongoose.Types.ObjectId,
      ref: "firmware",
    },
    createdBy: {
      type: String,
      default: "Adminstrator",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("car", CarScheme);

const mongoose = require("mongoose");
const FirmwareScheme = mongoose.Schema(
  {
    versionName: { type: String, required: true,unique:true },
    description: { type: String },
    file: { type: String, required: true },
    createdBy: {
      type: String,
      default: "Adminstrator",
      required: true,
    },
  },
  { Timestamps: true }
);

const Firmaware = mongoose.model("Firmware", FirmwareScheme);
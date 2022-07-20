const employee = require("../model/employee");
const Firmeware = require("../model/firmware");
var fs = require("fs");
var path = require("path");

const firmwareCtrl = {
  createFirmware: async (req, res) => {
    try {
      const { versionName, description } = req.body;
      console.log(req.file, req.body);
      const firmware = new Firmeware({
        versionName: versionName,
        description: description,
        file: req.file.path,
        createdBy: employee._id,
      });

      await firmware.save();
      res.status(200).json({
        msg: "Firmware added sucessfully",
        firmware: firmware,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getLatestFirmware: async (req, res) => {
    try {
      const firmware = await Firmeware.findOne().sort({ createdAt: -1 });
      fs.readFile(firmware.file, "utf8", function (err, data) {
        if (err) {
          return res.status(400).json({ msg: err.message });
        } else {
          return res.status(200).send(data);
        }
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getFirmware: async (req, res) => {
    try {
      const firmware = await Firmeware.findOne({
        versionName: req.params.version,
      });
      return res.status(200).json({ msg: "success", firmware: firmware });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getAllFirmwares: async (req, res) => {
    try {
      const firmwares = await Firmeware.find();
      return res
        .status(200)
        .json({ msg: "success getting firmwares", firmwares });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteFirmware: async (req, res) => {
    try {
      const { id } = req.body;
      await Firmeware.deleteOne({ _id: id });
      res.status(200).json({ msg: "firmware deleted successfully" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = firmwareCtrl;

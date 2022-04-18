const Firmeware = require("../model/firmware");

const firmwareCtrl = {
  createFirmware :async(req,res)=>{
    try {
      const {versionName,description,file,createdBy}= req.body;
    const firmware = new Firmeware({
        versionName:versionName,
        description: description,
        file: file,
        createdBy:createdBy
      });

      await firmware.save();
      res.status(200).json({
        msg: "Firmware added sucessfully",
        firmware: firmware,
      });
    } catch (err) {
      return res.status(500).json({msg:err.message});
    }
  },
  getLatestFirmware: async(req,res)=>{
    try {
      const firmware =await  Firmeware.findOne().sort({createdAt:-1});
      return res.status(200).json({msg:"success",firmware:firmware});
    } catch (err) {
      return res.status(500).json({msg:err.message});
    }
  },

  getFirmware: async(req,res)=>{
    try {
      const firmware =await  Firmeware.findOne({versionName:req.params.version});
      return res.status(200).json({msg:"success",firmware:firmware});
    } catch (err) {
      return res.status(500).json({msg:err.message});
    }
  },
  deleteFirmware: async(req,res)=>{
    try {
      const {id} = req.body;
      await Firmeware.deleteOne({_id:id});
      res.status(200).json({msg:"firmware deleted successfully"})

    } catch (err) {
      res.status(500).json({msg:err.message})
    }
  }

}

// {
//   "versionName":"V0.0.0",
//   "description":"this first firmware for fota system to update all ECUs",
//   "file":"0000101010101010000000010111000101010101111111111000001010101000000010000000001010000001111000000000000111110000000000011000000000100001000011111111111110000000000000000000000011111111111111111111110000000000000000000000001111111111111000000000000011111111111111111111111101111111111111111111000000000000000000011111111111111111111111100000000000000000001111111111111111111111101010101010000000000000000000001111111111111101111110000011111111000000001111111111000000011111111100000001111111110111111100000001111111111111100000000011111111111111111010100110",
//   "createdBy":"mahmoud makhlouf"
// }

module.exports = firmwareCtrl;
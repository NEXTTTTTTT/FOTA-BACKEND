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



module.exports = firmwareCtrl;
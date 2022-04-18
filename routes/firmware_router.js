const express = require('express');
const router = express.Router();

const firmwareController = require('../controllers/firmware_controller');



router.get("/firmware/:version",firmwareController.getFirmware);
router.get("/firmware/latest",firmwareController.getLatestFirmware);

router.post("/firmware/create",firmwareController.createFirmware);
router.delete("/firmware/delete/",firmwareController.deleteFirmware);


module.exports = router
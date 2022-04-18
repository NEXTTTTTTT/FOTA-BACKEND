const express = require('express');
const router = express.Router();

const firmwareController = require('../controllers/firmware_controller');



router.get("/firmware/:id",firmwareController.getFirmware);

router.post("/firmware/create",firmwareController.createFirmware);
router.delete("/firmware/delete/",firmwareController.deleteFirmware);


module.exports = router
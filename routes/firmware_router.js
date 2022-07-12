const express = require('express');
const router = express.Router();

const firmwareController = require('../controllers/firmware_controller');


const employeeAuth = require('../middlewares/employee_auth')

router.get("/firmware/:version",firmwareController.getFirmware);
router.get("/firmware/all",employeeAuth,firmwareController.getAllFirmwares);

router.get("/latest/firmware",firmwareController.getLatestFirmware);

router.post("/firmware/create",firmwareController.createFirmware);
router.delete("/firmware/delete/",firmwareController.deleteFirmware);


module.exports = router
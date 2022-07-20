const express = require('express');
const router = express.Router();

const firmwareController = require('../controllers/firmware_controller');


const employeeAuth = require('../middlewares/employee_auth')

//* uploading file */
const multer  = require('multer')
const upload = multer({ dest: './public/data/firmwares/'})

router.get("/firmware/:version",firmwareController.getFirmware);
router.get("/firmwares",employeeAuth,firmwareController.getAllFirmwares);

router.get("/latest/firmware",firmwareController.getLatestFirmware);

router.post("/firmware/create",employeeAuth,upload.single('file'), firmwareController.createFirmware);
router.delete("/firmware/delete/",employeeAuth,firmwareController.deleteFirmware);


module.exports = router
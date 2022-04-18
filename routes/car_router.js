const express = require('express');
const router = express.Router();


const carController = require('../controllers/car_controller');


router.get("/car/all",carController.getCarsList);
router.post("/car/create",carController.createCar);
router.delete("/car/delete/",carController.deleteCar);


module.exports = router
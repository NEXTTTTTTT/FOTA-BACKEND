const express = require('express');
const { route } = require('express/lib/application');
const router = express.Router();

var carController = require('../controllers/car_controller');

router.get("/cars",carController.getCarsList);
router.get("/cars/details/:id",carController.getCarDetails);
router.post("/cars/create",carController.createCar);
router.post("/cars/modify",carController.modifyCar);
router.delete("/cars/delete",carController.deleteCar);

module.exports = router
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

const carController = require('../controllers/car_controller');

/// Needed in web site
router.get("/cars/all",auth,carController.getCarsList);
router.post("/cars/create",auth,carController.createCar);
router.delete("/cars/delete/:code",auth,carController.deleteCar);


module.exports = router
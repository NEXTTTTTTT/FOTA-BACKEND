const express = require('express');
const router = express.Router();


const carController = require('../controllers/car_controller');
const employeeAuth = require('../middlewares/employee_auth')

router.get("/car/all",employeeAuth,carController.getCarsList);
router.get("/car/search/{id}",employeeAuth,carController.searchCar);
router.post("/car/create",employeeAuth,carController.createCar);
router.delete("/car/delete/",employeeAuth,carController.deleteCar);


module.exports = router
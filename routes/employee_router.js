const express = require('express');
const router = express.Router();


const employeeController = require('../controllers/employee_controller');
const employeeAuthController = require('../controllers/employee_auth_controller');

const employeeAuth = require('../middlewares/employee_auth')


router.get("/employee/all",employeeAuth, employeeController.getEmployees);
router.post("/employee/create",employeeAuth,employeeController.createEmployee);
router.delete("/employee/delete/",employeeAuth,employeeController.deleteEmployee);
router.post("/employee/login/",employeeAuth,employeeAuthController.login);


module.exports = router
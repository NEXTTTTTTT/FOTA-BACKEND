const express = require('express');
const router = express.Router();


const employeeController = require('../controllers/employee_controller');
const employeeAuthController = require('../controllers/employee_auth_controller');

const employeeAuth = require('../middlewares/employee_auth')

//* uploading file */
const multer  = require('multer')
const upload = multer({ dest: './public/data/avatars/'})


router.get("/employee/all",employeeAuth, employeeController.getEmployees);
router.post("/employee/create",employeeController.createEmployee);
router.delete("/employee/delete/",employeeAuth,employeeController.deleteEmployee);
router.post("/employee/login/",employeeAuthController.login);
router.patch("/employee/update/",employeeAuth, upload.single('profileImage'),employeeController.editEmployee);


module.exports = router
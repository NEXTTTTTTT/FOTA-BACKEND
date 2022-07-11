const router = require('express').Router();
const auth = require('../middlewares/auth');
const employeeAuth = require('../middlewares/employee_auth')

const userCtrl = require ('../controllers/userCtrl')

router.get('/search',auth, userCtrl.searchUser)
router.get('/user/:id',auth, userCtrl.getUser)
router.get('users/all',employeeAuth,userCtrl.getAllUsers)
router.patch('/user',auth, userCtrl.updateUser)

router.get('/user/car/:id',auth, userCtrl.getCars)

router.patch('/user/addCar',auth,userCtrl.addCar)
router.patch('/user/removeCar',auth,userCtrl.removeCar)

router.patch('/user/shareCar/',auth,userCtrl.shareCar)
router.patch('/user/unShareCar/',auth,userCtrl.unShareCar)
router.patch('/user/removeSharedCar/',auth,userCtrl.removeSharedCar)


module.exports = router;
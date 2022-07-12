const router = require('express').Router();
const auth = require('../middlewares/auth');
const employeeAuth = require('../middlewares/employee_auth')

const userCtrl = require ('../controllers/userCtrl')

router.get('/search',auth, userCtrl.searchUser)
router.get('/user/:id',auth, userCtrl.getUser)

router.patch('/user',auth, userCtrl.updateUser)

router.get('/user/car/',auth, userCtrl.getCars)

router.patch('/car/connect',auth,userCtrl.connectCar)
router.patch('/car/disconnect',auth,userCtrl.disconnectCar)

router.patch('/car/share',auth,userCtrl.shareCar)
router.patch('/car/user/remove',auth,userCtrl.removeUserAwayMyCar)

router.patch('/car/unshare',auth,userCtrl.unshareCar)

//* web app
router.get('users/all',employeeAuth,userCtrl.getAllUsers)

module.exports = router;
const express = require('express');
const router = express.Router();


const notifyController = require('../controllers/notify_controller.js');
const auth = require('../middlewares/auth')

router.get("/notify/all",auth,notifyController.getNotifyList);
router.patch("/notify/:id/read",auth,notifyController.readNotify);


module.exports = router
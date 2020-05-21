const express = require('express');
const router = express.Router();

console.log("Router loaded");
var homeController = require('../controllers/home_controller');
router.get('/',homeController.home);
router.get('/contactus',homeController.contactUs);

//using user router
router.use('/user',require('./users'));

//export these router
module.exports = router;
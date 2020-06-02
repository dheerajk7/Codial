const express = require('express');
const router = express.Router();

console.log("Router loaded");
var homeController = require('../controllers/home_controller');
router.get('/',homeController.home);
router.get('/contactus',homeController.contactUs);

//using user router
router.use('/users',require('./users'));

//using post router
router.use('/posts',require('./post'));

//using api router
router.use('/api',require('./api'));

//export these router
module.exports = router;
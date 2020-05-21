const express = require('express');
const router = express.Router();

console.log("Router loaded");
var homeController = require('../controllers/home_controller');
router.get('/',homeController.home);

//export these router
module.exports = router;
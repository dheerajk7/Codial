const express = require('express');
const router = express.Router();

const contactUsController = require('../controllers/contact_us_controller');
router.get('/contact',contactUsController.contact);

module.exports = router;
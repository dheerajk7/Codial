const express = require('express');
const router = express.Router();
const passport = require('passport');

const postController = require('../controllers/post_controller');
router.post('/add-post',passport.checkAuthentication,postController.addPost);

module.exports = router;
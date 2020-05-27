const express = require('express');
const router = express.Router();

const userController = require('../controllers/users_controller.js');
router.get('/profile',userController.profile);
router.get('/signup',userController.signUp);
router.get('/signin',userController.signIn);
router.post('/adduser',userController.addUser);
router.post('/create-session',userController.createSession);
module.exports = router;
const express = require('express');
const router = express.Router();
const passport = require('passport');


const userController = require('../controllers/users_controller.js');
router.get('/profile/:id',passport.checkAuthentication,userController.profile);
router.post('/update/:id',passport.checkAuthentication,userController.update);
router.get('/signup',userController.signUp);
router.get('/signin',userController.signIn);
router.post('/adduser',userController.addUser);
router.post('/create-session',passport.authenticate(
    'local',
    {
        failureRedirect:'/users/signin',
    }
),userController.createSession);        //use passport as middleware to authenticate
router.get('/signout',userController.signOut);

//google routes for sign in
router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/signin'}),userController.createSession);
router.get('/reset',userController.reset);
router.post('/reset-mail',userController.resetMail);
router.get('/reset-password/:token',userController.resetPassword);
module.exports = router;
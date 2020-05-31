const express = require('express');
const router = express.Router();
const passport = require('passport');

const postController = require('../controllers/post_controller');
router.post('/add-post',passport.checkAuthentication,postController.addPost);
router.post('/add-comment',passport.checkAuthentication,postController.addComment);
router.get('/delete/:id',passport.checkAuthentication,postController.deletePost);
router.get('/delete-comment/:id',passport.checkAuthentication,postController.deleteComment);

module.exports = router;
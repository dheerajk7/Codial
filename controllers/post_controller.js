const Post = require('../models/post');

module.exports.addPost = function(request,response)
{
    Post.create(
        {
            content:request.body.content,
            user:request.user,
        },
        function(err,post){
            if(err){console.log('Error in adding Post');return response.redirect('back');}
            console.log('Post Added Successfully');
            return response.redirect('/users/profile');
        });
}
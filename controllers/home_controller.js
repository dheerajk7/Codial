const Post = require('../models/post');

module.exports.home = function(request,response)
{
    // console.log(request.cookies);       //accessing cookie
    // response.cookie('user_id','45');     //updating cookie

    // Post.find({},function(err,posts)
    // {
    //     if(err){console.log("Error in fetching post");return;}
    //     return response.render('home',
    //     {
    //         title:'Home | Codial',
    //         posts:posts,
    //     })
    // });

    //populate user of each post
    Post.find({}).populate('user').exec(function(request,response)
    {
        if(err){console.log("Error in fetching post");return;}
        return response.render('home',
        {
            title:'Home | Codial',
            posts:posts,
        })
    });
}

module.exports.contactUs = function(request,response)
{
    return response.end('<h1>We will be contacting you shortly');
}
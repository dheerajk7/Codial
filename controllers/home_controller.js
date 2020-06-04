const Post = require('../models/post');
const User = require('../models/user');
module.exports.home = async function(request,response)
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
    //fetching post without comment
    // Post.find({}).populate('user').exec(function(err,posts)
    // {
    //     if(err){console.log("Error in fetching post");return;}
    //     return response.render('home',
    //     {
    //         title:'Home | Codial',
    //         posts:posts,
    //     })
    // });

    //fetching comment and post both
    /* normal way of doing these
    Post.find({})
    .populate('user').
    populate(
        {
            path:'comments',
            populate:
            {
                path:'user'
            },
        })
    .exec(function(err,posts)
    {
        if(err){console.log('Error in Fethcing Post');return;}
        User.find({},function(err,user)
        {
            return response.render('home',
        {
            title:'Home : Codial',
            posts:posts,
            users:user,
        });
        });
    });

    */

    //doing with async
    try{
        let post = await Post.find({}).sort('-createdAt').populate('user').populate(
            {
                path:'comments',
                populate:
                {
                    path:'user'
                },
                populate:
                {
                    path:'likes',
                }
            }).populate('likes');
        
        let user = await User.find({});
        return response.render('home',
        {
            title:'Home : Codial',
            posts:post,
            users:user,
        });
    }
    catch(err)
    {
        console.log("Error in code",err);
        return;
    }
}

module.exports.contactUs = function(request,response)
{
    return response.end('<h1>We will be contacting you shortly');
}
const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.addPost = function(request,response)
{
    Post.create(
        {
            content:request.body.content,
            user:request.user.id,
        },
        function(err,post){
            if(err){console.log('Error in adding Post');return response.redirect('back');}
            console.log('Post Added Successfully');
            return response.redirect('/');
        });
}

module.exports.addComment = function(request,response)
{
    Post.findById(request.body.post,function(err,post)
    {
        if(err)
        {
            console.log('Error in finding Post');
            return;
        }
        if(post)
        {
            Comment.create({
                content:request.body.comment,
                post:request.body.post,
                user:request.user.id,
            },function(err,comment)
            {
                if(err)
                {
                    console.log('Error in creating Comment');
                    return;
                }
                if(comment)
                {
                    post.comments.push(comment._id);
                    post.save();
                    return response.redirect('/')
                }
                else
                {
                    return response.redirect('/');
                }
            });
        }
        else
        {
            return response.redirect('/');
        }
    });
}

module.exports.deletePost = async function(request,response)
{
    try{
        let post = await Post.findById(request.params.id);
        if(post && post.user == request.user.id)
        {
            post.remove();
            await Comment.deleteMany({post:request.params.post});
            return response.redirect('back');
        }
        else
        {
            return response.redirect('back');
        }
    }
    catch(err)
    {
        console.log('Error');
        return;
    }
}

module.exports.deleteComment = function(request,response)
{
    Comment.findById(request.params.id,function(err,comment)
    {
        let userId = null;
        Post.findById(comment.post,function(err,post)
        {
            if(post)
            {
                userId = post.user;
            }
        });

        if(comment.user == request.user.id || userId == request.user.id)
        {
            let postId = comment.post;
            comment.remove();
            Post.findByIdAndUpdate(postId,{$pull : {comments:request.params.id}},function(err,post)
            {
                console.log(post.user,request.user.id);
                if(post && post.user == request.user.id)
                {
                    console.log('a');
                    comment.remove();
                }
                return response.redirect('back');
            });
        }
        else
        {
            return response.redirect('back');
        }
    });
}
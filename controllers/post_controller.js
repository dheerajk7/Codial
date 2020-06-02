const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');

module.exports.addPost = async function(request,response)
{
    try{
        let post = await Post.create(
            {
                content:request.body.content,
                user:request.user.id,
            });

        // console.log('aa',post.id);
        console.log(request.user.name);

            //detect type of request as ajax
            if(request.xhr)
            {
                return response.status(200).json(
                    {
                        data:
                        {
                            post:post,
                            userName:request.user.name,
                        },
                        message:"Post Added"
                    }
                );
                console.log('done');
            }
            request.flash('success','Post Added Successfully');
            return response.redirect('back');
    }catch(err)
    {
        request.flash('error',err);
        return response.redirect('back');
    }
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
            if(request.xhr)
            {
                return response.status(200).json({data:
                    {
                    post_id : request.params.id,
                    },
                    message:'Post deleted'
            })
            }
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
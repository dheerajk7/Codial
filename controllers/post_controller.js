const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const commentMailer = require('../mailers/comments_mailer');
const commentEmailWorker = require('../worker/comment_email_worker');
const queue = require('../config/kue');
const Like = require('../models/like');

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

module.exports.addComment = async function(request,response)
{
    try
    {
        let post = await Post.findById(request.body.post);
        if(post)
        {
            let comment = await Comment.create(
                {
                    content:request.body.comment,
                    post:request.body.post,
                    user:request.user._id,
                }
            );
            post.comments.push(comment);
            post.save();

            comment = await comment.populate('user','name email').execPopulate();
            // commentMailer.newComment(comment);
            let job = queue.create('emails',comment).save(function(err)
            {
                if(err)
                {
                    console.log('Error in sending to queue ',err);
                    return;
                }
                console.log('Job enqueued ',job.id);
            });
            if(request.xhr)
            {
                return response.status(200).json(
                    {
                        data:{
                            comment:comment,
                        },
                        message:'Comment Added'   
                    }
                );
            }

            request.flash('success','Comment Added');
            response.redirect('/');
        }
        else
        {
            console.log('here is error');
            return;
        }
    }
    catch(err)
    {
        if(err)
        {
            console.log('Error in adding comment',err);
            return;
        }
    }

    // Post.findById(request.body.post,function(err,post)
    // {
    //     if(err)
    //     {
    //         console.log('Error in finding Post');
    //         return;
    //     }
    //     if(post)
    //     {
    //         Comment.create({
    //             content:request.body.comment,
    //             post:request.body.post,
    //             user:request.user.id,
    //         },function(err,comment)
    //         {
    //             if(err)
    //             {
    //                 console.log('Error in creating Comment');
    //                 return;
    //             }
    //             if(comment)
    //             {
    //                 post.comments.push(comment._id);
    //                 post.save();
    //                 commentMailer.newComment(comment);
    //                 return response.redirect('/')
    //             }
    //             else
    //             {
    //                 return response.redirect('/');
    //             }
    //         });
    //     }
    //     else
    //     {
    //         return response.redirect('/');
    //     }
    // });
}

module.exports.deletePost = async function(request,response)
{
    try{
        let post = await Post.findById(request.params.id);
        if(post && post.user == request.user.id)
        {
            await Like.deleteMany({likeable: post, onModel: 'Post'});
            await Like.deleteMany({_id: {$in: post.comments}});
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
            // CHANGE :: destroy the associated likes for this comment
            Like.deleteMany({likeable: comment._id, onModel: 'Comment'});

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

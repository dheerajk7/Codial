const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.getPost = async function(request,response)
{
    try{
        let post = await Post.find({}).sort('-createdAt').populate('user').populate(
            {
                path:'comments',
                populate:
                {
                    path:'user'
                },
            });


        return response.status(200).json({
            message:"List of Posts",
            posts:post,
        });
    }
    catch(err)
    {
        return response.json(500,
            {
                message:"Internal Server Error",
            });
    }  
}

module.exports.deletePost = async function(request,response)
{
    try{
        let post = await Post.findById(request.params.id);
        if(post && post.user == request.user.id)
        {
            post.remove();
            await Comment.deleteMany({post:request.params.post});
            return response.status(200).json(
                {
                    message:'Post deleted',
                }
            );
        }
        else
        {
            return response.status(401).json(
                {
                    message:"You can not delete this post",
                });
        }
    }
    catch(err)
    {
        return response.status(200).json(
            {
                message:'Error in deleting post',
            }
        );
    }
}
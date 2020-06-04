const Like = require('../models/like');
const Post = require('../models/post');

module.exports.toggleLike = async function(request,response)
{
    try{
        // like/toggle/?id=abcd&type=Post

        let likeable;
        let deleted = false;

        if(request.query.type == 'Post')
        {
            likeable = await Post.findById(request.query.id).populate('likes');
        }
        else
        {
            likeable = await Comment.findById(request.query.id).populate('likes');
        }

        //exitsting like
        
        let existingLike = await Like.findOne(
            {
                likeable:request.query.id,
                onModel:request.query.type,
                user:request.user._id,
            }
        );

        //if like already exist then delete it

        if(existingLike)
        {
            likeable.likes.pull(existingLike._id);
            likeable.save();
            existingLike.remove();
            deleted = true;
        }
        else
        {
            let newLike = await Like.create(
                {
                    user:request.user._id,
                    likeable:request.query.id,
                    onModel:request.query.type,
                }
            );

            likeable.likes.push(newLike._id);
            likeable.save();
        }
        return response.status(200).json(
            {
                message:'Request Successfull',
                data:
                {
                    deleted:deleted,
                }
            }
        );
    }
    catch(err)
    {
        return response.status(501).json(
            {
                message:'Error in liking',
            }
        );
    }
}
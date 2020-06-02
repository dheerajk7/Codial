const User = require('../../../models/user');
const jwt = require('jsonwebtoken');

module.exports.createSession = async function(request,response)
{
    try
    {
        let user = await User.findOne({email:request.body.email});
        if(!user || user.password != request.body.password)
        {
            return response.status(402).json(
                {
                    message:'Invalid username or password',
                }
            );
        }

        return response.status(200).json(
            {
                message:'Sign In successful,here is your token, keep it safe',
                token:jwt.sign(user.toJSON(),'codial',{expiresIn:100000}),
            }
        );

    }
    catch(err)
    {
        return response.status(500).json({
            message:'Internal server error',
        });
    }
}
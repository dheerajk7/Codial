module.exports.index = function(request,response)
{
    return response.json(200,
        {
            message:"List of Posts",
            posts:["list"],
        }
    );
}
module.exports.profile = function(request,response)
{
    return response.render('user',{
        title : "User Section | Codial",
    });
}
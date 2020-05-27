module.exports.home = function(request,response)
{
    // console.log(request.cookies);       //accessing cookie
    // response.cookie('user_id','45');     //updating cookie
    return response.render('home',{
        title:'Home | Codial',
    });
};

module.exports.contactUs = function(request,response)
{
    return response.end('<h1>We will be contacting you shortly');
}
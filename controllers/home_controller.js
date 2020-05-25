module.exports.home = function(request,response)
{
    return response.render('home',{
        title:'Home | Codial',
    });
};

module.exports.contactUs = function(request,response)
{
    return response.end('<h1>We will be contacting you shortly');
}
module.exports.home = function(request,response)
{
    return response.end('<h1>We are ready for CODIAL!');
};

module.exports.contactUs = function(request,response)
{
    return response.end('<h1>We will be contacting you shortly');
}
const User = require('../models/user');

module.exports.profile = function(request,response)
{
    User.findById(request.params.id,function(err,user)
    {
        return response.render('user',{
            title : "User Section | Codial",
            profile_user:user,
        });
    });
    
}

module.exports.update = function(request,response)
{
    if(request.user.id == request.params.id)
    {
        User.findByIdAndUpdate(request.params.id,
        {
            name: request.body.name,
            email: request.body.email,
        },function(err,user)
        {
            return response.redirect('back');
        });
    }
    else
    {
        return response.status(401).send("UnAuthorized");
    }
}

//render sign up page
module.exports.signUp = function(request,response)
{
    if(request.isAuthenticated())
    {
        return response.redirect('/users/profile');
    }
    return response.render('sign_up',
    {
        title:'Codial | Sign Up',
    });
}

//render sign in page
module.exports.signIn = function(request,response)
{
    if(request.isAuthenticated())
    {
        return response.redirect('/users/profile');
    }
    return response.render('sign_in',{
        title:'Codial | Sign In',
    });
}

//adding user
module.exports.addUser = function(request,response)
{
    console.log('print request',request.body);
    if(request.body.password != request.body.confirm_password)
    {
        console.log("Password doesn't matched");
        return response.redirect('back');
    }

    User.findOne({email:request.body.email},function(err,user)
    {
        if(err){console.log('Error in finding User');return redirect('back')};
        if(!user)
        {
            User.create(
                {
                    email:request.body.email,
                    password:request.body.password,
                    name:request.body.username,
                },
                function(err,newContact)
                {
                    if(err)
                    {
                        console.log('Error in adding user');
                        return response.redirect('back');
                    }
                    console.log('new contact is added successfully');
                    return response.redirect('/users/signin');
                }
            );
        }
        else
        {
            console.log('User already exist');
            return response.redirect('/users/signin');
        }
    });
    
}

//sign in and create session for user
module.exports.createSession = function(request,response)
{
    request.flash('success','Logged in Successfully');
    return response.redirect('/');
};

module.exports.signOut = function(request,response)
{
    request.logout();
    request.flash('success','Logged Out Successfully');
    return response.redirect('/');
}
const User = require('../models/user');

module.exports.profile = function(request,response)
{
    if(request.cookies.user_id)
    {
        User.findOne({_id:request.cookies.user_id},function(err,user)
        {
            if(err){console.log("Error in finding user");return response.redirect('/users/signin');}
            if(user)
            {
                console.log("we are here");
                return response.render('user',
                {
                    title: 'User Section |',
                    email: user.email,
                    name:user.name,
                });
            }
            else
            {
                return response.redirect('/users/signin');
            }
        });
    }
    else
    {
        return response.redirect('/users/signin');
    }
}

//render sign up page
module.exports.signUp = function(request,response)
{
    return response.render('sign_up',
    {
        title:'Codial | Sign Up',
    });
}

//render sign in page
module.exports.signIn = function(request,response)
{
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
    //finding user
    User.findOne({email:request.body.email},function(err,user)
    {
        //checking error
        if(err){console.log("Error in finding User");return response.redirect('back')};
        //handle user found
        if(user)
        {
            //handle password mathced
            if(request.body.password == user.password)
            {
                console.log('Password Matched');
                response.cookie('user_id',user.id);
                return response.redirect('/users/profile')
            }
            //handle password doesn't match
            else
            {
                console.log("Password Doesn't Matched");
                return response.redirect('back');
            }
        }
        //handle user not found
        else
        {
            console.log('User not found');
            return response.redirect('back');
        }
    });
};

//signout function
module.exports.signOut = function(request,response)
{
    if(request.cookies.user_id)
    {
        response.cookie('user_id',undefined);
        return response.redirect('/users/signin');
    }
}
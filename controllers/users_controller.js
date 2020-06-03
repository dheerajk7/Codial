const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const ResetToken = require('../models/reset_token');
const forgetPasswordMailer = require('../mailers/forget_password_mailer');

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

module.exports.update = async function(request,response)
{
    if(request.user.id == request.params.id)
    {
        try
        {
            let user = await User.findByIdAndUpdate(request.params.id);
            User.uploadAvatar(request,response,function(err)
            {
                if(err){console.log('Error in multer')};
                user.name = request.body.name;
                user.email = request.body.email;
                if(request.file)
                {
                    if(user.avatar)
                    {
                        fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                    }
                    user.avatar = User.avatarPath + '/' + request.file.filename;
                }
                user.save();
                return response.redirect('back');
            });
        }
        catch(err)
        {
            request.flash('error',err);
            return response.redirect('back');
        }
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
        request.flash('error','password does not matched');
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

module.exports.reset = function(request,response)
{
    return response.render('reset',{
        title:'Reset Password | Codial'
    });
}

module.exports.resetMail = async function(request,response)
{
    try{
        let user = await User.findOne({email:request.body.email});
        let token = await ResetToken.deleteOne({email:request.body.email});
        if(user)
        {
            let token = await ResetToken.create(
                {
                    email:request.body.email,
                    access_token:Date.now(),
                    is_valid:true,
                }
            );
            forgetPasswordMailer.forgetPassword(token);
            request.flash('success','Email sent to registered mail id');
            return response.redirect('/users/signin');
        }
        else
        {
            request.flash('error','Email not Exist');
            return response.redirect('back');
        }
    }
    catch(err)
    {
        console.log('Error in creating token',err);
        return;
    }
}

module.exports.resetPassword = async function(request,response)
{
    try
    {
        let token = await ResetToken.findOne({access_token:request.params.token});
        if(token && token.is_valid == true)
        {
            // let update = await token.updateOne({is_valid:false});
            return response.render('reset_password',
            {
                title:'New Passoword | Codial',
                token:token.access_token,
            })
        }
        else
        {
            request.flash('error','Link Expired');
            return response.redirect('/users/reset');
        }
    }
    catch(err)
    {
        console.log('Error in reseting Password ',err);
        return;
    }
}

module.exports.savePassword = async function(request,response)
{
    try
    {
        if(request.body.newPassword == request.body.confirmPassword)
        {
            let token = await ResetToken.findOne({access_token:request.params.token});
            if(token && token.is_valid == true)
            {
                await token.updateOne({is_valid:false});
                let user = await User.findOne({email:token.email});
                if(user)
                {
                    await user.updateOne({password:request.body.newPassword});
                    request.flash('success','Password Changed Successfully');
                    await ResetToken.deleteOne({access_token:request.params.token});
                    return response.redirect('/users/signin');
                }
                else
                {
                    request.flash('error','Link Expired');
                    await ResetToken.deleteOne({access_token:request.params.token});
                    return response.redirect('/users/reset');
                }
                a
            }
            else
            {
                request.flash('error','Link Expired');
                return response.redirect('/users/reset');
            }
        }
        else
        {
            request.flash('error','Password Does not matched');
            return response.redirect('back');
        }
        
    }
    catch(err)
    {
        console.log('Error in saving password ',err);
        return;
    }
}
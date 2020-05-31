const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');
//authentication using passport
passport.use(new LocalStrategy(
    {
        usernameField:'email',
        passReqToCallback:true,
    },
    function(request,email,password,done)
    {
        //finding user and establish identity
        User.findOne({email:email},function(err,user)
        {
            if(err)
            {
                request.flash('error','Error in Sign in');
                return done(err);
            }

            if(!user || user.password != password)
            {
                console.log("Password doesn't matched...!");
                request.flash('error','Password does not matched');
                return done(null,false);
            }

            return done(null,user);
        });
    }
));

passport.checkAuthentication = function(request,response,next)
{
    if(request.isAuthenticated())
    {
        //if user is authenticated pass on the request to next function(controllers action)
        return next();
    }
    //if user is not signed in
    return response.redirect('/users/signin');
}

passport.setAuthenticatedUser = function(request,response,next)
{
    if(request.isAuthenticated())
    {
        //request.user contains the current signed in user from the session cookie and we are just sending this to the locals for views
        response.locals.user = request.user;
    }
    next();
}
//serializing the user to decide which key is to kept in cookie

passport.serializeUser(function(user,done)
{
    done(null,user.id);
});


//deserializing the user from the key in the cookies

passport.deserializeUser(function(id,done)
{
    User.findById(id,function(err,user)
    {
        if(err)
        {
            console.log('Error in finding user');
            return done(err);
        }
        return done(null,user);
    });
});

module.exports = passport;
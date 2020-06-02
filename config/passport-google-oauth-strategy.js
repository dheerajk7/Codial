const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

//tell passport to use new stategy for google login
passport.use(new googleStrategy(
    {
        clientID: "951098497367-ueql8ecs442sr192bdc6st7lgdaltbad.apps.googleusercontent.com",
        clientSecret: "4rVZzKz4mGdcrk9jFltIYKEJ",
        callbackURL : "http://localhost:8000/users/auth/google/callback",
    },
    function(accessToken,refreshToken,profile,done)
    {
        User.findOne({email:profile.emails[0].value}).exec(function(err,user)
        {
            if(err)
            {
                console.log('Error in google strategy-passport');
                return;
            }
            console.log(profile);
            if(user)
            {
                //if user found then set these user to request.user
                return done(null,user);
            }
            else
            {
                //if user not found create it and then sign in it
                User.create(
                    {
                        name:profile.displayName,
                        email:profile.emails[0].value,
                        password:crypto.randomBytes(20).toString('hex'),
                    },
                    function(err,user)
                    {
                        if(err)
                        {
                            console.log('Error in google strategy');r
                            return;
                        }
                        if(user)
                        {
                            return done(null,user);
                        }
                        else
                        {
                            return done(null,false);
                        }
                    }
                );
            }
        });
    }
));

module.exports = passport;
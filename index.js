const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
//middleware for scss
const sassMiddleware = require('node-sass-middleware');
app.use(sassMiddleware(
    {
        src:'./assets/scss',
        dest:'./assets/css',
        debug:true,
        outputStyle:'compressed',
        prefix:'/css/'
    }
));
//used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
//mongo store for storing session
const MongoStore = require('connect-mongo')(session);
//getting layout
var expressLayouts = require('express-ejs-layouts');
// using layout
app.use(expressLayouts);
app.use(express.urlencoded());

//using cookies
app.use(cookieParser());
//database
const db = require('./config/mongoose');
//using static fine
app.use(express.static('./assets'));

//extract styles and scripts from sub pages into layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.set('view engine', 'ejs');
app.set('views','./views');

//mongo store is used to store session cookie in DB
app.use(session(
    {
        name:'codial',
        //todo change the secret before deployment in production
        secret:'blahsomething',
        saveUninitialized:false,
        resave:false,
        cookie:
        {
            maxAge:(1000*60*100),  //number of milinutes in miliseconds
        },
        store: new MongoStore(
            {
                mongooseConnection:db,
                autoRemove:'disabled',
            },
            function(err)
            {
                if(err)
                {
                    console.log('Error in storing session');
                }
                console.log('Mongo Store Connected');
            }),
    }
));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

//accessing router
app.use('/',require('./routes/index.js'));

app.listen(port,function(error)
{
    if(error)
    {
        //interpollation
        console.log("Error in running server",err);
        //we can do same thing with
        console.log(`Error in running server ${err}`);
        return;
    }
    // console.log("Server is running and up at : ",port);
    console.log(`Server is running and up at port : ${port}`);
    return;
});
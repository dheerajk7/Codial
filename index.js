const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
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

//accessing router
app.use('/',require('./routes/index.js'));
app.set('view engine', 'ejs');
app.set('views','./views');

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
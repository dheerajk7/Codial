const express = require('express');
const app = express();
const port = 8000;

//accessing router

app.use('/',require('./routes/index.js'));
app.use('/',require('./routes/contact_us'));
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
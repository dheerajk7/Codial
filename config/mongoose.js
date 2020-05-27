const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/codeial_development');

const db = mongoose.connection;

db.on('error',console.error.bind(console,"Error connecting to Mongo DB"));

db.once('open',() => 
{
    console.log('Data Base Connected');
});

module.exports = db;
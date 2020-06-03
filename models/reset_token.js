const mongoose = require('mongoose');

const resetSchema = new mongoose.Schema(
    {
        email:
        {
            type:String,
            required:true,
        },
        access_token:
        {
            type:String,
            required:true,
        },
        is_valid:
        {
            type:Boolean,
            required:true,
        }
    },
    {
        timestamps:true,
    }
);

const resetModel = mongoose.model('ResetPassword',resetSchema);
module.exports = resetModel;
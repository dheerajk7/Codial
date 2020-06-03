const nodeMailer = require('../config/nodemailer');

exports.forgetPassword = (token) =>
{
    console.log('Inside new comment mailer');
    console.log('token here', token.access_token);
    let htmlString = nodeMailer.renderTemplate({token:token.access_token},'/reset/reset_password.ejs')
    nodeMailer.transporter.sendMail(
        {
            from:'contact@codial.com',
            to:token.email,
            subject:'Reset Password',
            html:htmlString,
        },
        function(err,info)
        {
            if(err)
            {
                console.log('Error in sending mail',err);
                return;
            }
            console.log('Message sent ',info);
            return;
        }
    );
}
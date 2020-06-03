const nodeMailer = require('../config/nodemailer');

exports.newComment = (comment) =>
{
    console.log('Inside new comment mailer');

    let htmlString = nodeMailer.renderTemplate({comment:comment},'/comments/new_comment.ejs')
    nodeMailer.transporter.sendMail(
        {
            from:'contact@codial.com',
            to:comment.user.email,
            subject:'New comment Published',
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
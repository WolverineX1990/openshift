'use strict';
const nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    host: 'smtp.eqxiu.com',
    tls: {
        rejectUnauthorized: false
    },
    auth: options.auth
});

var mailOptions = {
    from: options.auth.user,
    to: options.toUser,
    subject: options.title
};

function email() {
    mailOptions.html = 11111;
    transporter.sendMail(mailOptions, function(error, info) {
        if(error) {
            console.log('error');
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}

module.exports = email;
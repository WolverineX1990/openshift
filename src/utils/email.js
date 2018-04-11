'use strict';
const nodemailer = require('nodemailer');
const api = require('./../api');
var transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    tls: {
        rejectUnauthorized: false
    },
    auth: {
        user: 'zhengchangjun@eqxiu.com',
        pass: ''
    }
});

var mailOptions = {
    from: '1248198090@qq.com',
    to: '2460799976@qq.com',
    subject: 'test'
};

function email() {
    // mailOptions.html = 11111;
    // transporter.sendMail(mailOptions, function(error, info) {
    //     if(error) {
    //         console.log('error');
    //         return console.log(error);
    //     }
    //     console.log('Message sent: ' + info.response);
    // });
    api.getRabMoney()
        .then(res=>console.log(res));
}

module.exports = email;
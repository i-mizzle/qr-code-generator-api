'use strict';
const response = require('./../responses');
const nodemailer = require('nodemailer');

const mongoose = require("mongoose");
const User = mongoose.model('User');
module.exports = {
sendEmail: async (mailParams, req, res) => {
    try{
        console.log('MAIL PARAMS+++++++++++++++++++', mailParams)
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        let testAccount = await nodemailer.createTestAccount();
        // var mailParams = req.body

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'mail.airhaul.com.ng',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: 'noreply@airhaul.com.ng', // generated ethereal user
                pass: 'noreply@airhaul' // generated ethereal password
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Airhaul" <noreply@airhaul.com.ng>', // sender address
            // to: 'immanuel.o.onum@gmail.com', // list of receivers 
            to: mailParams.mailTo, // list of receivers 
            subject: mailParams.subject, // Subject line
            text: mailParams.message, // plain text body
            html: '<p>' + mailParams.message + '</p>'
        });

        console.log('Message sent: %s', info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

        // return response.ok(res, {
        //     messageId: info.messageId,
        //     previewUrl: nodemailer.getTestMessageUrl(info)
        // });
        return true
    }
    catch (error) {

        console.log(error)
        // return response.error(res, error);
        return false
    }
}
}
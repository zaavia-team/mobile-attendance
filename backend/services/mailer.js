"use strict";
const nodemailer = require("nodemailer");
// const emailhistoryController = require('../controllers/EmailHistoriesController').Controller.RTM.emailhistory;

// async..await is not allowed in global scope, must use a wrapper
exports.sendEmail = async function sendEmail(obj, To) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let SMPTConfigObj = {
        auth: {
            user:  process.env.Email,
            pass: process.env.Password
        },
        tls: {
            rejectUnauthorized: false
        }
    };
    if ((process.env.SMTPHost) == 'Gmail') {
        SMPTConfigObj.service = process.env.SMTPHost;
    } 
    else {
        SMPTConfigObj.host = process.env.SMTPHost || 'smtp.gmail.com';
        SMPTConfigObj.port = Number(process.env.EMAILPORT) || 465;
        SMPTConfigObj.secure = process.env.IsSSL ;
    }
    if (Array.isArray(To)) {
        To = To.join("; ");
    }
    var message = {
        // sender info
        from:  process.env.Email,
        // Comma separated list of recipients
        to: To,
        // Subject of the message
        subject: obj.Subject,
        // HTML body
        html: obj.message

    };
    //obj.fromAddress = process.env.Email;
    if (obj.cc) {
        message.cc = obj.cc;
    }
    if (obj.bcc) {
        message.bcc = obj.bcc;
    }

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport(SMPTConfigObj);
    // send mail with defined transport object
    return transporter.sendMail(message);
}
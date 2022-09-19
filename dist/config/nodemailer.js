"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailInitiator = void 0;
var nodemailer = require("nodemailer");
var dotenv = require("dotenv").config();
// var mailOptions = {
//   from: "gfgcuiet.tech@gmail.com",
//   to: "gfgcuiet.tech@gmail.com",
//   text: "This is some text",
//   html: "<b>This is some HTML</b>",
// };
// Send e-mail using SMTP
// mailOptions.subject = "Nodemailer SMTP transporter";
var smtpTransporter = nodemailer.createTransport({
    port: 465,
    host: process.env.AWS_HOST,
    secure: true,
    auth: {
        user: process.env.AWS_SES_USER,
        pass: process.env.AWS_SES_PASSWORD,
    },
    debug: true,
});
const mailInitiator = (mailOptions) => {
    smtpTransporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        }
        else {
            console.log("Message sent: " + info.response);
        }
    });
};
exports.mailInitiator = mailInitiator;

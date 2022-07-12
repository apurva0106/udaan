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
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.email,
        pass: process.env.pass
    }
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

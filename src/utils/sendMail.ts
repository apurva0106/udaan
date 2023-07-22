// const ejs = require("ejs");
// const path = require("path");
// const { mailInitiator } = require("../config/mailer");
// const printSafe = require("./safePrint");

import ejs from "ejs";
import path from "path";
import { mailInitiator } from "../config/nodemailer";

const mailSender = async (
  senderAddress: string,
  subject: string,
  mailData: object,
  templateName: string
) => {
  let htmlData;

  ejs.renderFile(
    path.join(__dirname, `../../views/mailTemplates/${templateName}.ejs`),
    { data: mailData },
    (err, template) => {
      if (err) {
        // printSafe(["error in rendering the template", err]);
        console.log("error in rendering the template ", err);
        return;
      }
      htmlData = template;
    }
  );

  let mailOptions = {
    from: "no-reply@contact.karanchugh.in",
    to: senderAddress,
    subject: subject,
    html: htmlData,
  };

  mailInitiator(mailOptions);
};

export { mailSender };

"use strict";
// const ejs = require("ejs");
// const path = require("path");
// const { mailInitiator } = require("../config/mailer");
// const printSafe = require("./safePrint");
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailSender = void 0;
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const nodemailer_1 = require("../config/nodemailer");
const mailSender = (senderAddress, subject, mailData, templateName) => __awaiter(void 0, void 0, void 0, function* () {
    let htmlData;
    ejs_1.default.renderFile(path_1.default.join(__dirname, `../../views/mailTemplates/${templateName}.ejs`), { data: mailData }, (err, template) => {
        if (err) {
            // printSafe(["error in rendering the template", err]);
            console.log("error in rendering the template ", err);
            return;
        }
        htmlData = template;
    });
    let mailOptions = {
        from: "apurva0106.be20@chitkara.edu.in",
        to: senderAddress,
        subject: subject,
        html: htmlData,
    };
    (0, nodemailer_1.mailInitiator)(mailOptions);
});
exports.mailSender = mailSender;

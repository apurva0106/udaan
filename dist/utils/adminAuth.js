"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdminMiddleware = exports.verifyAdminLogin = void 0;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const salt = 10;
const JWT_SECRET = process.env.jwt;
// const Admin = require("../models/users/admin");
const admin_1 = require("../model/admin");
const verifyAdminLogin = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield admin_1.Admin.findOne({ email }).lean();
        if (!admin) {
            return { status: "error", error: "admin not found" };
        }
        if (yield bcrypt.compare(password, admin.password)) {
            // creating a token
            let token = jwt.sign({ id: admin._id, username: admin.email, type: "admin" }, JWT_SECRET, { expiresIn: 60 * 60 * 5 });
            return { status: "ok", data: token };
        }
        return { status: "error", error: "invalid password" };
    }
    catch (error) {
        return { status: "error", error: "timed out" };
    }
});
exports.verifyAdminLogin = verifyAdminLogin;
const verifyAdminMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("query is ", req.originalUrl);
        if (req.originalUrl === "/admin/signIn") {
            return next();
        }
        if (req.cookies.token) {
            const verify = jwt.verify(req.cookies.token, JWT_SECRET);
            console.log("verify is ", verify);
            if (verify.type === "admin") {
                return next();
            }
        }
        return res.redirect("/admin/signIn");
    }
    catch (error) {
        console.log(JSON.stringify(error), "error");
        return res.redirect("/admin/signIn");
    }
});
exports.verifyAdminMiddleware = verifyAdminMiddleware;
const queryUrlExtractor = (queryUrl) => {
    let query = queryUrl.substring(7);
    let finString = "";
    for (let i = 0; i < query.length; i++) {
        if (query[i] === "/") {
            break;
        }
        else {
            finString += query[i];
        }
    }
    return finString;
};

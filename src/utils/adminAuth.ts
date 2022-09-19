const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const salt = 10;
const JWT_SECRET = process.env.jwt;
// const Admin = require("../models/users/admin");
import { Admin } from '../model/admin';
import express from 'express'

const verifyAdminLogin = async (email: string, password: string) => {
    try {
        const admin = await Admin.findOne({ email }).lean();
        if (!admin) {
            return { status: "error", error: "admin not found" };
        }
        if (await bcrypt.compare(password, admin.password)) {
            // creating a token
            let token = jwt.sign(
                { id: admin._id, username: admin.email, type: "admin" },
                JWT_SECRET,
                { expiresIn: 60 * 60 * 5 }
            );
            return { status: "ok", data: token };
        }
        return { status: "error", error: "invalid password" };
    } catch (error) {
        return { status: "error", error: "timed out" };
    }
};

const verifyAdminMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
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
    } catch (error) {
        console.log(JSON.stringify(error), "error");
        return res.redirect("/admin/signIn");
    }
};

const queryUrlExtractor = (queryUrl: string) => {
    let query = queryUrl.substring(7);
    let finString = "";
    for (let i = 0; i < query.length; i++) {
        if (query[i] === "/") {
            break;
        } else {
            finString += query[i];
        }
    }
    return finString;
};

export { verifyAdminLogin, verifyAdminMiddleware }
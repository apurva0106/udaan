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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUserLogin = exports.isLoggedIn = void 0;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const salt = 10;
require('dotenv').config();
const JWT_SECRET = process.env.jwt;
const user_1 = __importDefault(require("../model/user"));
const verifyToken = (token) => {
    try {
        const verify = jwt.verify(token, JWT_SECRET);
        if (verify.type === 'user') {
            return true;
        }
        else {
            return false;
        }
        ;
    }
    catch (error) {
        console.log(JSON.stringify(error), "error");
        return false;
    }
};
// user login function
const verifyUserLogin = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findOne({ email }).lean();
        if (!user) {
            return { status: 'error', error: 'user not found' };
        }
        if (!user.isVerified && (yield bcrypt.compare(password, user.password))) {
            return { status: 'notVerified', data: user._id };
        }
        if (yield bcrypt.compare(password, user.password)) {
            // creating a JWT token
            let token = jwt.sign({ id: user._id, username: user.email, type: 'user' }, JWT_SECRET, { expiresIn: '2h' });
            return { status: 'ok', data: token };
        }
        return { status: 'error', error: 'invalid password' };
    }
    catch (error) {
        console.log(error);
        return { status: 'error', error: 'timed out' };
    }
});
exports.verifyUserLogin = verifyUserLogin;
const isLoggedIn = (req, res, next) => {
    console.log('req.query path is ', req.originalUrl);
    console.log(req.originalUrl.includes('verifyOtp'));
    if (req.originalUrl.includes('verifyOtp')) {
        return next();
    }
    if (req.originalUrl === "/user/signIn" || req.originalUrl === "/user/signUp") {
        return next();
    }
    const { token } = req.cookies;
    if (verifyToken(token)) {
        return next();
    }
    else {
        return res.redirect('/user/signIn');
    }
};
exports.isLoggedIn = isLoggedIn;

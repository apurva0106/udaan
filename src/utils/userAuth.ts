const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const salt = 10;
require('dotenv').config();
const JWT_SECRET = process.env.jwt;
import express from 'express';
import User from '../model/user';



const verifyToken = (token: string) => {
    try {
        const verify = jwt.verify(token, JWT_SECRET);
        if (verify.type === 'user') { return true; }
        else { return false };
    } catch (error) {
        console.log(JSON.stringify(error), "error");
        return false;
    }
}

// user login function
const verifyUserLogin = async (email: string, password: string) => {
    try {
        const user = await User.findOne({ email }).lean()
        if (!user) {
            return { status: 'error', error: 'user not found' }
        }

        if (!user.isVerified && await bcrypt.compare(password, user.password)) {
            return { status: 'notVerified', data: user._id }
        }

        if (await bcrypt.compare(password, user.password)) {
            // creating a JWT token
            let token = jwt.sign({ id: user._id, username: user.email, type: 'user' }, JWT_SECRET, { expiresIn: '2h' })
            return { status: 'ok', data: token }
        }
        return { status: 'error', error: 'invalid password' }
    } catch (error) {
        console.log(error);
        return { status: 'error', error: 'timed out' }
    }
}


const isLoggedIn = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log('req.query path is ', req.originalUrl)
    console.log(req.originalUrl.includes('verifyOtp'))
    if (req.originalUrl.includes('verifyOtp')) {
        return next();
    }
    if (req.originalUrl === "/user/signIn" || req.originalUrl === "/user/signUp") {
        return next();
    }
    const { token } = req.cookies;
    if (verifyToken(token)) {
        return next();
    } else {
        return res.redirect('/user/signIn')
    }
}

export { isLoggedIn, verifyUserLogin }
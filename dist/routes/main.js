"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminAuth_1 = require("../utils/adminAuth");
const userAuth_1 = require("../utils/userAuth");
let mainRoutes = (0, express_1.Router)();
mainRoutes.get('/', (req, res) => {
    return res.redirect('/home');
});
mainRoutes.use('/user', userAuth_1.isLoggedIn, require('./user/index'));
mainRoutes.use('/admin', adminAuth_1.verifyAdminMiddleware, require('./admin/index'));
mainRoutes.use('/home', require('./home/index'));
module.exports = mainRoutes;

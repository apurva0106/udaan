"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require('dotenv').config();
const port = process.env.port || 8000;
const app = (0, express_1.default)();
const db = require('./config/mongoose');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static('assets'));
app.set('view engine', 'ejs');
app.use('/', require('./routes/main'));
app.listen(port, () => { console.log('server running on port', port); });

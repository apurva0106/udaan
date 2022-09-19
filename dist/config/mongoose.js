"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv").config();
const mongourl = process.env.MONGO_URI;
const config = {
    useNewUrlParser: true,
};
mongoose_1.default.connect(mongourl || "mongodb://localhost:27017/udaan-dev", (err) => {
    if (err) {
        console.log("error in connecting to mongoose", err);
        return;
    }
    console.log("connected to mongoose");
});
//

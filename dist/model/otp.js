"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const otpSchema = new mongoose_1.default.Schema({
    otp: {
        type: Number,
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'users'
    }
}, {
    timestamps: true,
    expireAfterSeconds: 1200
});
const Otp = mongoose_1.default.model('otp', otpSchema);
exports.default = Otp;

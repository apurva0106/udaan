"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const responseSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'user'
    },
    details: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    postId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'post'
    },
    imageLink: {
        type: String,
        required: true
    },
    isValid: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
const Response = mongoose_1.default.model('response', responseSchema);
exports.default = Response;

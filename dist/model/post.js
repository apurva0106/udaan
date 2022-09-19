"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    fatherName: {
        type: String,
        requied: true
    },
    age: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    locationOfMissing: {
        type: String,
        required: true
    },
    dateOfMissing: {
        type: String,
        required: true
    },
    closeDate: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isFound: {
        type: Boolean,
        default: false
    },
    imageLink: {
        type: String
    },
    posterLink: {
        type: String
    },
    responses: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'response'
        }
    ],
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'user'
    }
}, {
    timestamps: true
});
const Post = mongoose_1.default.model('post', postSchema);
exports.default = Post;

import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
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
        type: mongoose.Schema.Types.ObjectId,
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

const Response = mongoose.model('response', responseSchema);
export default Response;
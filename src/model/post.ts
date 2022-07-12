import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
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
            type: mongoose.Schema.Types.ObjectId,
            ref: 'response'
        }
    ],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
}, {
    timestamps: true
});

const Post = mongoose.model('post', postSchema);
export default Post;
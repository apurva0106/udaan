import mongoose from 'mongoose'


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unqiue: true
    },
    contact: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'post'
        }
    ]
}, {
    timestamps: true
});

const User = mongoose.model('user', userSchema);
export default User;
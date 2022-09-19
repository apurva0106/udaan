import mongoose from 'mongoose';


const otpSchema = new mongoose.Schema({
    otp: {
        type: Number,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
}, {
    timestamps: true,
    expireAfterSeconds: 1200
});

const Otp = mongoose.model('otp', otpSchema);

export default Otp;
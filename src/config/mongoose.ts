import mongoose from 'mongoose'
require("dotenv").config();
const mongourl = process.env.MONGO_URI;
const config = {
    useNewUrlParser: true,
};
mongoose.connect(
    mongourl || "mongodb://localhost:27017/udaan-dev",
    (err) => {
        if (err) {
            console.log("error in connecting to mongoose", err);
            return;
        }
        console.log("connected to mongoose");
    }
);
//
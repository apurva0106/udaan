const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
import express from 'express';
require("dotenv").config();
cloudinary.config({
    cloud_name: `${process.env.cloudinary_cloud_name}`,
    api_key: `${process.env.cloudinary_api_key}`,
    api_secret: `${process.env.cloudinary_api_secret}`,
    secure: true,
});

let streamUpload = (req: any) => {
    return new Promise((resolve, reject) => {
        console.log("in stream upload");
        let stream = cloudinary.uploader.upload_stream((error: any, result: any) => {
            console.log("result is ", result);
            if (result) {
                console.log("resolving");
                resolve(result);
            } else {
                console.log("rejecting");
                reject(error);
            }
        });
        streamifier.createReadStream(req.file.buffer!).pipe(stream);
    });
};

async function uploadImage(req: express.Request) {
    try {
        console.log("in upload file function");
        console.log("req is ", req);
        let result = await streamUpload(req);
        console.log(result);
        return result;
    } catch (error) {
        return { message: "image not uploaded", error };
    }
}

module.exports = uploadImage;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
require("dotenv").config();
cloudinary.config({
    cloud_name: `${process.env.cloudinary_cloud_name}`,
    api_key: `${process.env.cloudinary_api_key}`,
    api_secret: `${process.env.cloudinary_api_secret}`,
    secure: true,
});
let streamUpload = (req) => {
    return new Promise((resolve, reject) => {
        console.log("in stream upload");
        let stream = cloudinary.uploader.upload_stream((error, result) => {
            console.log("result is ", result);
            if (result) {
                console.log("resolving");
                resolve(result);
            }
            else {
                console.log("rejecting");
                reject(error);
            }
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
};
function uploadImage(req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("in upload file function");
            console.log("req is ", req);
            let result = yield streamUpload(req);
            console.log(result);
            return result;
        }
        catch (error) {
            return { message: "image not uploaded", error };
        }
    });
}
module.exports = uploadImage;

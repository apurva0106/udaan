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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRoutes = (0, express_1.Router)();
const post_1 = __importDefault(require("../../model/post"));
const response_1 = __importDefault(require("../../model/response"));
const user_1 = __importDefault(require("../../model/user"));
const hashPassword_1 = __importDefault(require("../../utils/hashPassword"));
const userAuth_1 = require("../../utils/userAuth");
const index_1 = require("./utils/index");
const multer_1 = __importDefault(require("multer"));
const fileUpload = (0, multer_1.default)();
const uploadImage = require('../../config/cloudinary');
const JWT_SECRET = process.env.jwt;
const jwt = require("jsonwebtoken");
const moment_1 = __importDefault(require("moment"));
const node_html_to_image_1 = __importDefault(require("node-html-to-image"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const sendMail_1 = require("../../utils/sendMail");
const otp_1 = __importDefault(require("../../model/otp"));
const dateParse_1 = __importDefault(require("../../utils/dateParse"));
userRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let currDate = (0, moment_1.default)().format('YYYY-MM-DDTHH:mm:ssZ');
    let currMonthDate = (0, moment_1.default)().startOf('month');
    console.log('currdate is ', currDate);
    console.log('currmonth is ', currMonthDate);
    let daysArray = [];
    let monthsArray = [];
    let daysMonthsArray = [];
    //last seven days data
    // for (let i = 0; i < 7; i++) {
    //     daysArray.push(currDate);
    //     currDate = moment(currDate).subtract(1, 'day').startOf('day').format('YYYY-MM-DDTHH:mm:ssZ');
    // }
    // for (let i = 7; i >= 0; i--) {
    //     let checkDate = moment().subtract(i, "d").startOf("day").toDate();
    //     let nextDate = moment(checkDate).add(1, "days").toDate();
    // }
    //last 12 months data
    for (let i = 1; i <= 12; i++) {
        monthsArray.push(currMonthDate.format('MMMM'));
        let tempObj = {
            startMonthDate: currMonthDate.format('YYYY-MM-DDTHH:mm:ssZ'),
            endMonthDate: currMonthDate.add(1, 'M').format('YYYY-MM-DDTHH:mm:ssZ')
        };
        daysMonthsArray.push(tempObj);
    }
    console.log('months array data is ', monthsArray);
    let finalMonthsDataArray = [];
    let finalOutputData;
    // await Promise.all(
    for (let i = 0; i < monthsArray.length; i++) {
        let dayMonthData = daysMonthsArray[i];
        let TotalDataCount = yield post_1.default.find({
            createdAt: {
                $gte: dayMonthData.startMonthDate,
                $lte: dayMonthData.endMonthDate
            }
        }).count();
        let LocatedDataCount = yield post_1.default.find({
            createdAt: {
                $gte: dayMonthData.endMonthDate,
                $lte: dayMonthData.startMonthDate
            },
            isFound: true
        }).count();
        let RespondedDataCount = yield post_1.default.find({
            createdAt: {
                $gte: dayMonthData.endMonthDate,
                $lte: dayMonthData.startMonthDate
            },
            isFound: false,
            'responses.0': {
                $exists: true
            }
        }).count();
        let pendingDataCount = yield post_1.default.find({
            createdAt: {
                $gte: dayMonthData.endMonthDate,
                $lte: dayMonthData.startMonthDate
            },
            isFound: false,
            'responses.0': {
                $exists: false
            }
        }).count();
        let tempObj = {
            monthName: monthsArray[i],
            TotalData: TotalDataCount,
            LocatedData: LocatedDataCount,
            RespondedData: RespondedDataCount,
            pendingData: pendingDataCount
        };
        // console.log('tempObj is ', tempObj);
        finalMonthsDataArray.push(tempObj);
    }
    // )
    console.log(' and final months data array is ', finalMonthsDataArray);
    finalOutputData = {
        labels: [],
        values: {
            TotalData: [],
            PendingData: [],
            LocatedData: [],
            RespondedData: []
        }
    };
    for (let monthData of finalMonthsDataArray) {
        finalOutputData.labels.push(monthData.monthName);
        finalOutputData.values.PendingData.push(monthData.pendingData);
        finalOutputData.values.LocatedData.push(monthData.LocatedData);
        finalOutputData.values.RespondedData.push(monthData.RespondedData);
        finalOutputData.values.TotalData.push(monthData.TotalData);
    }
    finalOutputData.labels.reverse();
    finalOutputData.values.TotalData.reverse();
    finalOutputData.values.PendingData.reverse();
    finalOutputData.values.RespondedData.reverse();
    finalOutputData.values.LocatedData.reverse();
    console.log('final output data is ', finalOutputData);
    return res.render('user', { data: finalOutputData });
}));
userRoutes.get('/signUp', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.render('userAuth/userSignup');
}));
userRoutes.post('/signUp', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name, email, contact, password } = req.body;
        let checkUser = yield user_1.default.findOne({ email });
        if (!checkUser) {
            let newUser = yield user_1.default.create({
                name, email, contact, password: yield (0, hashPassword_1.default)(password)
            });
            let otp = Math.floor(100000 + Math.random() * 900000);
            console.log('otp is ', otp);
            let newOtp = yield otp_1.default.create({
                otp: otp,
                userId: newUser._id,
            });
            console.log('new otp is ', newOtp);
            yield (0, sendMail_1.mailSender)(email, 'Otp', { name, otp }, 'otp');
            return res.render('userAuth/otpVerify', {
                data: { userId: newUser._id }
            });
        }
        return res.redirect('back');
    }
    catch (e) {
        console.log('error in creating user ', e);
        return res.redirect('back');
    }
}));
userRoutes.post('/verifyOtp/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let currOtp = yield otp_1.default.findOne({ userId: req.params.userId });
        if (!currOtp) {
            return res.redirect(`/resendOtp/${req.params.userId}`);
        }
        else {
            if (currOtp.otp == req.body.otp) {
                // console.log('otp are ',)
                yield user_1.default.findByIdAndUpdate(req.params.userId, { isVerified: true });
                return res.redirect('/user/signIn');
            }
            else {
                return res.redirect('back');
            }
        }
        return res.redirect('back');
    }
    catch (e) {
        console.log('error in verifying otp ', e);
        return res.redirect('back');
    }
}));
userRoutes.get('/resendOtp/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let otp = Math.floor(100000 + Math.random() * 900000);
        console.log('otp is ', otp);
        let newOtp = yield otp_1.default.create({
            otp: otp,
            userId: req.params.userId,
        });
        let currUser = yield user_1.default.findById(req.params.userId);
        yield (0, sendMail_1.mailSender)(currUser.email, 'Otp', { otp, name: currUser.name }, 'otp');
        return res.redirect(`/user/verifyOtp/${req.params.userId}`);
    }
    catch (e) {
        console.log('error in resending otp ', e);
        return res.redirect('back');
    }
}));
//sign in
userRoutes.get('/signIn', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.render('userAuth/userLogin');
}));
userRoutes.post('/signIn', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, password } = req.body;
    const response = yield (0, userAuth_1.verifyUserLogin)(email, password);
    if (response.status === 'ok') {
        res.cookie("token", response.data, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true }); // maxAge: 2 hours
        res.redirect('/user');
    }
    else if (response.status == 'notVerified') {
        return res.render('userAuth/otpVerify', {
            data: { userId: response.data }
        });
    }
    else {
        res.redirect('back');
    }
}));
//dashboard
//my-posts
userRoutes.get('/myPosts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.cookies.token;
        const verify = jwt.verify(token, JWT_SECRET);
        let postsData = yield post_1.default.find({ userId: verify.id });
        // let populatedPostsData = await Post.populate(postsData, options);
        let updatedPostsData = yield (0, index_1.postDataFetcher)(postsData);
        console.log('posts data is ', updatedPostsData);
        return res.render('user/posts', {
            data: updatedPostsData
        });
    }
    catch (e) {
        console.log('error in fetching posts data ', e);
        return res.send([]);
    }
}));
//create-post
userRoutes.post('/createPost', fileUpload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let imageUploadData = yield uploadImage(req);
        let imageLink = imageUploadData.secure_url;
        let { name, fatherName, age, city, state, locationOfMissing, dateOfMissing } = req.body;
        let token = req.cookies.token;
        const verify = jwt.verify(token, JWT_SECRET);
        let newPost = yield post_1.default.create({
            name, fatherName, age, city, state, locationOfMissing, dateOfMissing, userId: verify.id, imageLink
        });
        yield user_1.default.findByIdAndUpdate(verify.id, {
            $push: {
                posts: newPost._id
            }
        });
        return res.redirect('back');
    }
    catch (e) {
        console.log('error in creating post', e);
        return res.redirect('back');
    }
}));
userRoutes.get('/getImagePoster/:postId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let currPost = yield post_1.default.findById(req.params.postId);
        let renderData = {
            name: currPost.name,
            imageLink: currPost === null || currPost === void 0 ? void 0 : currPost.imageLink
        };
        console.log(__dirname);
        let htmlData = yield ejs_1.default.renderFile(path_1.default.join(__dirname + '../../../../views/templates/poster.ejs'), {
            data: renderData
        });
        let name = Date.now();
        (0, node_html_to_image_1.default)({
            output: path_1.default.join(__dirname, `../../../assets/${name}.jpg`),
            html: htmlData
        }).then(() => {
            console.log('htmlData is ', htmlData);
            setTimeout(() => {
                (0, fs_1.unlink)(path_1.default.join(__dirname, `../../../assets/${name}.jpg`), () => {
                    console.log('file deleted');
                });
            }, 5000);
            return res.download(path_1.default.join(__dirname, `../../../assets/${name}.jpg`));
        });
    }
    catch (e) {
        return res.redirect('back');
    }
}));
userRoutes.get('/updatePostStatus/:postId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.cookies.token;
        const verify = jwt.verify(token, JWT_SECRET);
        let currPost = yield post_1.default.findById(req.params.postId);
        if (currPost && currPost.userId == verify.id) {
            currPost.isFound = true;
            currPost.closeDate = (0, moment_1.default)().format('YYYY-DD-MM');
            yield currPost.save();
        }
        return res.redirect('back');
    }
    catch (e) {
        console.log('error in updating post', e);
        return res.redirect('back');
    }
}));
//getting responses of specific post
userRoutes.get('/getResponses/:postId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.cookies.token;
        const verify = jwt.verify(token, JWT_SECRET);
        let currPost = yield post_1.default.findById(req.params.postId).populate('responses');
        if (currPost.userId == verify.id) {
            let options = {
                path: 'responses.userId',
                model: user_1.default
            };
            let populatedPost = yield post_1.default.populate(currPost, options);
            let finalData = yield (0, index_1.responseDataFetcher)(populatedPost.responses);
            console.log('final response data is ', finalData);
            return res.render('user/postResponse', {
                data: finalData
            });
        }
    }
    catch (e) {
        console.log('error in getting responses data ', e);
        return res.redirect('back');
    }
}));
//locate-post
userRoutes.post('/createResponse', fileUpload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let imageUploadData = yield uploadImage(req);
        let imageLink = imageUploadData.secure_url;
        let { details, address } = req.body;
        let token = req.cookies.token;
        console.log('image link is ', imageLink);
        const verify = jwt.verify(token, JWT_SECRET);
        // console.log('req.body is ', req.body);
        let newResponse = yield response_1.default.create({
            details, address, postId: req.body.postId, userId: verify.id, imageLink
        });
        yield post_1.default.findByIdAndUpdate(req.body.postId, {
            $push: {
                responses: newResponse._id
            }
        });
        return res.redirect('back');
    }
    catch (e) {
        console.log('error in adding response ', e);
        return res.redirect('back');
    }
}));
userRoutes.get('/validateResponse/:responseId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let currResponse = yield response_1.default.findById(req.params.responseId);
        let currPost = yield post_1.default.findById(currResponse === null || currResponse === void 0 ? void 0 : currResponse.postId);
        let postUser = yield user_1.default.findById(currPost === null || currPost === void 0 ? void 0 : currPost.userId);
        let token = req.cookies.token;
        const verify = jwt.verify(token, JWT_SECRET);
        if (verify.id == (postUser === null || postUser === void 0 ? void 0 : postUser._id)) {
            currResponse.isValid = true;
            yield (currResponse === null || currResponse === void 0 ? void 0 : currResponse.save());
        }
        return res.redirect('back');
    }
    catch (e) {
        console.log('error in validating ', e);
        return res.redirect('back');
    }
}));
userRoutes.get('/allPosts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let postsData = yield post_1.default.find({ isActive: true });
        let updatedPostsData = yield (0, index_1.postDataFetcher)(postsData);
        console.log('updated posts data is ', updatedPostsData);
        return res.render('user/allPosts', {
            data: updatedPostsData.activePosts
        });
    }
    catch (e) {
        console.log('error in getting posts', e);
        return res.redirect('back');
    }
}));
userRoutes.get('/profile', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.cookies.token;
        const verify = jwt.verify(token, JWT_SECRET);
        let currUser = yield user_1.default.findById(verify.id);
        let responsesCount = yield response_1.default.find({ userId: currUser._id }).count();
        let finalObj = {
            name: currUser.name,
            contact: currUser.contact,
            email: currUser.email,
            noOfPosts: currUser.posts && currUser.posts.length,
            noOfResponses: responsesCount,
            dateAdded: (0, dateParse_1.default)(currUser.createdAt)
        };
        return res.render('user/profile', {
            data: finalObj
        });
    }
    catch (e) {
        console.log('error in rendering profile', e);
        return res.redirect('back');
    }
}));
module.exports = userRoutes;

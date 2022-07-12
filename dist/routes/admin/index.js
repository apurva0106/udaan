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
const post_1 = __importDefault(require("../../model/post"));
const response_1 = __importDefault(require("../../model/response"));
const user_1 = __importDefault(require("../../model/user"));
const adminAuth_1 = require("../../utils/adminAuth");
const utils_1 = require("../user/utils");
const moment_1 = __importDefault(require("moment"));
const utils_2 = require("./utils");
const adminRoutes = (0, express_1.Router)();
//rendering dashboard
adminRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.render('admin');
}));
//rendering sign in page
adminRoutes.get('/signIn', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.render('adminAuth/adminLogin');
}));
//submitting sign in page
adminRoutes.post('/signIn', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, password } = req.body;
    const response = yield (0, adminAuth_1.verifyAdminLogin)(email, password);
    if (response.status === 'ok') {
        res.cookie("token", response.data, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true }); // maxAge: 2 hours
        res.redirect('/admin');
    }
    else {
        res.redirect('back');
    }
}));
//getting all posts
adminRoutes.get('/posts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let postsData = yield post_1.default.find({});
        let updatedPostsData = yield (0, utils_1.postDataFetcher)(postsData);
        return res.render('admin/posts', {
            data: updatedPostsData
        });
    }
    catch (e) {
        console.log('error in getting all posts ', e);
        return res.redirect('back');
        ;
    }
}));
//disable the post
adminRoutes.get('/switchPostState/:postId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // await Post.findByIdAndUpdate(req.params.postId, { isActive: false });
        let currPost = yield post_1.default.findById(req.params.postId);
        currPost.isActive = !(currPost === null || currPost === void 0 ? void 0 : currPost.isActive);
        yield (currPost === null || currPost === void 0 ? void 0 : currPost.save());
        return res.redirect('back');
    }
    catch (e) {
        console.log('error in disabling the post ', e);
        return res.redirect('back');
    }
}));
//marking locate through admin panel
adminRoutes.get('/updatePostStatus/:postId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield post_1.default.findByIdAndUpdate(req.params.postId, { isFound: true, closeDate: (0, moment_1.default)().format('YYYY-MM-DD') });
        return res.redirect('back');
    }
    catch (e) {
        console.log('error in updating post status ', e);
        return res.redirect('back');
    }
}));
//view responses
adminRoutes.get('/getResponses/:postId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let responsesData = yield response_1.default.find({ postId: req.params.postId }).populate('userId');
        let updatedResponsesData = yield (0, utils_1.responseDataFetcher)(responsesData);
        return res.render('admin/postResponses', {
            data: updatedResponsesData
        });
    }
    catch (e) {
        console.log('error in getting responses', e);
        return res.redirect('back');
    }
}));
//getting all users
adminRoutes.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let usersData = yield user_1.default.find({}).populate('posts');
        let updatedUsersData = yield (0, utils_2.userDataFetcher)(usersData);
        return res.render('admin/users', { data: updatedUsersData });
    }
    catch (e) {
        console.log('error in getting users ', e);
        return res.redirect('back');
    }
}));
//disabling or enable a user
adminRoutes.get('/changeState/:userId', () => __awaiter(void 0, void 0, void 0, function* () { }));
module.exports = adminRoutes;

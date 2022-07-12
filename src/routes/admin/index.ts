import { Router } from "express";
import { response } from "../../dto/response.dto";
import Post from "../../model/post";
import Response from "../../model/response";
import User from "../../model/user";
import { verifyAdminLogin } from "../../utils/adminAuth";
import { postDataFetcher, responseDataFetcher } from "../user/utils";
import moment from 'moment';
import { userDataFetcher } from "./utils";
const adminRoutes = Router();



//rendering dashboard
adminRoutes.get('/', async (req, res) => {
    return res.render('admin')
});


//rendering sign in page
adminRoutes.get('/signIn', async (req, res) => {
    return res.render('adminAuth/adminLogin')
});


//submitting sign in page
adminRoutes.post('/signIn', async (req, res) => {
    let { email, password } = req.body;
    const response = await verifyAdminLogin(email, password);
    if (response.status === 'ok') {
        res.cookie("token", response.data, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true }); // maxAge: 2 hours
        res.redirect('/admin');
    } else {
        res.redirect('back');
    }
});


//getting all posts
adminRoutes.get('/posts', async (req, res) => {
    try {
        let postsData = await Post.find({});
        let updatedPostsData = await postDataFetcher(postsData);
        return res.render('admin/posts', {
            data: updatedPostsData
        });
    } catch (e) {
        console.log('error in getting all posts ', e);
        return res.redirect('back');;
    }
});


//disable the post
adminRoutes.get('/switchPostState/:postId', async (req, res) => {
    try {
        // await Post.findByIdAndUpdate(req.params.postId, { isActive: false });
        let currPost: any = await Post.findById(req.params.postId);
        currPost.isActive = !currPost?.isActive;
        await currPost?.save();
        return res.redirect('back');
    } catch (e) {
        console.log('error in disabling the post ', e);
        return res.redirect('back');
    }
});

//marking locate through admin panel
adminRoutes.get('/updatePostStatus/:postId', async (req, res) => {
    try {
        await Post.findByIdAndUpdate(req.params.postId, { isFound: true, closeDate: moment().format('YYYY-MM-DD') });
        return res.redirect('back');
    } catch (e) {
        console.log('error in updating post status ', e);
        return res.redirect('back');
    }
})

//view responses
adminRoutes.get('/getResponses/:postId', async (req, res) => {
    try {
        let responsesData = await Response.find({ postId: req.params.postId }).populate('userId');
        let updatedResponsesData: Array<response> = await responseDataFetcher(responsesData);
        return res.render('admin/postResponses', {
            data: updatedResponsesData
        });
    } catch (e) {
        console.log('error in getting responses', e);
        return res.redirect('back');
    }
});


//getting all users
adminRoutes.get('/users', async (req, res) => {
    try {
        let usersData = await User.find({}).populate('posts');
        let updatedUsersData = await userDataFetcher(usersData);
        return res.render('admin/users', { data: updatedUsersData })
    } catch (e) {
        console.log('error in getting users ', e);
        return res.redirect('back')
    }
});


//disabling or enable a user
adminRoutes.get('/changeState/:userId', async () => { });




module.exports = adminRoutes;
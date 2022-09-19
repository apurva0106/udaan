import { Router } from 'express';
import { post } from '../../dto/post.dto';
import { userPost } from '../../dto/user.post.dto';

const userRoutes = Router();
import { monthsDataDto } from '../../dto/monthsData.dto'
import { daysMontsDto } from '../../dto/daysMonths.dto'
import Post from '../../model/post';
import Response from '../../model/response';
import User from '../../model/user';
import hashPassword from '../../utils/hashPassword';
import { verifyUserLogin } from '../../utils/userAuth';
import { postDataFetcher, responseDataFetcher } from './utils/index'
import multer from 'multer';
const fileUpload = multer();
const uploadImage = require('../../config/cloudinary')
const JWT_SECRET = process.env.jwt;
const jwt = require("jsonwebtoken");
import moment, { months } from 'moment';
import nodeHtmlToImage from 'node-html-to-image'
import ejs from 'ejs'
import path from 'path'
import { unlink } from 'fs';
import { outputMonthsDto } from '../../dto/outputMonths.dto'
import { mailSender } from '../../utils/sendMail'
import Otp from '../../model/otp';
import dateParser from '../../utils/dateParse';

userRoutes.get('/', async (req, res) => {

    let currDate = moment().format('YYYY-MM-DDTHH:mm:ssZ');
    let currMonthDate = moment().startOf('month');
    console.log('currdate is ', currDate);
    console.log('currmonth is ', currMonthDate);
    let daysArray = [];
    let monthsArray = [];
    let daysMonthsArray: Array<daysMontsDto> = [];

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
        let tempObj: daysMontsDto = {
            startMonthDate: currMonthDate.format('YYYY-MM-DDTHH:mm:ssZ'),
            endMonthDate: currMonthDate.add(1, 'M').format('YYYY-MM-DDTHH:mm:ssZ')
        }
        daysMonthsArray.push(tempObj);

    }

    console.log('months array data is ', monthsArray);

    let finalMonthsDataArray: Array<monthsDataDto> = [];
    let finalOutputData: outputMonthsDto

    // await Promise.all(

    for (let i = 0; i < monthsArray.length; i++) {

        let dayMonthData: any = daysMonthsArray[i];
        let TotalDataCount = await Post.find({
            createdAt: {
                $gte: dayMonthData.startMonthDate,
                $lte: dayMonthData.endMonthDate
            }
        }).count();

        let LocatedDataCount = await Post.find({
            createdAt: {
                $gte: dayMonthData.endMonthDate,
                $lte: dayMonthData.startMonthDate
            },
            isFound: true
        }).count();

        let RespondedDataCount = await Post.find({
            createdAt: {
                $gte: dayMonthData.endMonthDate,
                $lte: dayMonthData.startMonthDate
            },
            isFound: false,
            'responses.0': {
                $exists: true
            }
        }).count();

        let pendingDataCount = await Post.find({
            createdAt: {
                $gte: dayMonthData.endMonthDate,
                $lte: dayMonthData.startMonthDate
            },
            isFound: false,
            'responses.0': {
                $exists: false
            }
        }).count();


        let tempObj: monthsDataDto = {
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
    }


    for (let monthData of finalMonthsDataArray) {
        finalOutputData.labels.push(monthData.monthName);
        finalOutputData.values.PendingData.push(monthData.pendingData);
        finalOutputData.values.LocatedData.push(monthData.LocatedData);
        finalOutputData.values.RespondedData.push(monthData.RespondedData)
        finalOutputData.values.TotalData.push(monthData.TotalData);
    }


    finalOutputData.labels.reverse();
    finalOutputData.values.TotalData.reverse();
    finalOutputData.values.PendingData.reverse();
    finalOutputData.values.RespondedData.reverse();
    finalOutputData.values.LocatedData.reverse();

    console.log('final output data is ', finalOutputData);

    return res.render('user', { data: finalOutputData })



})


userRoutes.get('/signUp', async (req, res) => {
    return res.render('userAuth/userSignup');
})

userRoutes.post('/signUp', async (req, res): Promise<any> => {
    try {
        let { name, email, contact, password } = req.body;

        let checkUser = await User.findOne({ email });
        if (!checkUser) {
            let newUser: any = await User.create({
                name, email, contact, password: await hashPassword(password)
            });

            let otp = Math.floor(100000 + Math.random() * 900000);
            console.log('otp is ', otp);

            let newOtp = await Otp.create({
                otp: otp,
                userId: newUser._id,
            });

            console.log('new otp is ', newOtp);

            await mailSender(email, 'Otp', { name, otp }, 'otp');

            return res.render('userAuth/otpVerify', {
                data: { userId: newUser._id }
            })
        }

        return res.redirect('back')

    } catch (e) {
        console.log('error in creating user ', e);
        return res.redirect('back');
    }
});


userRoutes.post('/verifyOtp/:userId', async (req, res) => {
    try {
        let currOtp = await Otp.findOne({ userId: req.params.userId });
        if (!currOtp) {
            return res.redirect(`/resendOtp/${req.params.userId}`)
        } else {
            if (currOtp.otp == req.body.otp) {
                // console.log('otp are ',)
                await User.findByIdAndUpdate(req.params.userId, { isVerified: true });
                return res.redirect('/user/signIn');
            } else {
                return res.redirect('back');
            }
        }

        return res.redirect('back');

    } catch (e) {

        console.log('error in verifying otp ', e);
        return res.redirect('back');
    }
});


userRoutes.get('/resendOtp/:userId', async (req, res) => {
    try {
        let otp = Math.floor(100000 + Math.random() * 900000);
        console.log('otp is ', otp);

        let newOtp = await Otp.create({
            otp: otp,
            userId: req.params.userId,
        });
        let currUser: any = await User.findById(req.params.userId);
        await mailSender(currUser.email, 'Otp', { otp, name: currUser.name }, 'otp');


        return res.redirect(`/user/verifyOtp/${req.params.userId}`)
    } catch (e) {
        console.log('error in resending otp ', e);
        return res.redirect('back');
    }
});



//sign in
userRoutes.get('/signIn', async (req, res) => {
    return res.render('userAuth/userLogin')
});

userRoutes.post('/signIn', async (req, res) => {
    let { email, password } = req.body;
    const response = await verifyUserLogin(email, password);
    if (response.status === 'ok') {
        res.cookie("token", response.data, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true }); // maxAge: 2 hours
        res.redirect('/user');
    } else if (response.status == 'notVerified') {
        return res.render('userAuth/otpVerify', {
            data: { userId: response.data }
        })
    } else {
        res.redirect('back')
    }
})

//dashboard

//my-posts
userRoutes.get('/myPosts', async (req, res) => {
    try {
        let token = req.cookies.token;
        const verify = jwt.verify(token, JWT_SECRET);
        let postsData = await Post.find({ userId: verify.id });



        // let populatedPostsData = await Post.populate(postsData, options);

        let updatedPostsData: userPost = await postDataFetcher(postsData);

        console.log('posts data is ', updatedPostsData);
        return res.render('user/posts', {
            data: updatedPostsData
        });
    } catch (e) {
        console.log('error in fetching posts data ', e);
        return res.send([]);
    }
});


//create-post
userRoutes.post('/createPost', fileUpload.single('image'), async (req, res) => {
    try {

        let imageUploadData = await uploadImage(req);
        let imageLink = imageUploadData.secure_url;
        let { name, fatherName, age, city, state, locationOfMissing, dateOfMissing } = req.body;

        let token = req.cookies.token;
        const verify = jwt.verify(token, JWT_SECRET);


        let newPost = await Post.create({
            name, fatherName, age, city, state, locationOfMissing, dateOfMissing, userId: verify.id, imageLink
        });

        await User.findByIdAndUpdate(verify.id, {
            $push: {
                posts: newPost._id
            }
        })

        return res.redirect('back');
    } catch (e) {
        console.log('error in creating post', e);
        return res.redirect('back');
    }
});

userRoutes.get('/getImagePoster/:postId', async (req, res) => {
    try {
        let currPost: any = await Post.findById(req.params.postId);

        let renderData = {
            name: currPost.name,
            imageLink: currPost?.imageLink
        };

        console.log(__dirname);
        let htmlData = await ejs.renderFile(path.join(__dirname + '../../../../views/templates/poster.ejs'), {
            data: renderData
        });

        let name = Date.now();
        nodeHtmlToImage({
            output: path.join(__dirname, `../../../assets/${name}.jpg`),
            html: htmlData
        }).then(() => {
            console.log('htmlData is ', htmlData);
            setTimeout(() => {
                unlink(path.join(__dirname, `../../../assets/${name}.jpg`), () => {
                    console.log('file deleted');
                });
            }, 5000)
            return res.download(path.join(__dirname, `../../../assets/${name}.jpg`))
        });


    } catch (e) {

        return res.redirect('back');
    }
})

userRoutes.get('/updatePostStatus/:postId', async (req, res) => {
    try {
        let token = req.cookies.token;
        const verify = jwt.verify(token, JWT_SECRET);
        let currPost: any = await Post.findById(req.params.postId);

        if (currPost && currPost.userId == verify.id) {
            currPost.isFound = true;
            currPost.closeDate = moment().format('YYYY-DD-MM')
            await currPost.save();
        }

        return res.redirect('back');
    } catch (e) {
        console.log('error in updating post', e);
        return res.redirect('back');
    }
});



//getting responses of specific post

userRoutes.get('/getResponses/:postId', async (req, res) => {
    try {
        let token = req.cookies.token;
        const verify = jwt.verify(token, JWT_SECRET);

        let currPost: any = await Post.findById(req.params.postId).populate('responses');
        if (currPost.userId == verify.id) {
            let options = {
                path: 'responses.userId',
                model: User
            };

            let populatedPost: any = await Post.populate(currPost, options);

            let finalData = await responseDataFetcher(populatedPost.responses);
            console.log('final response data is ', finalData);
            return res.render('user/postResponse', {
                data: finalData
            });
        }
    } catch (e) {
        console.log('error in getting responses data ', e);
        return res.redirect('back');
    }
});

//locate-post
userRoutes.post('/createResponse', fileUpload.single('image'), async (req, res) => {
    try {
        let imageUploadData = await uploadImage(req);
        let imageLink = imageUploadData.secure_url;
        let { details, address } = req.body;
        let token = req.cookies.token;
        console.log('image link is ', imageLink);
        const verify = jwt.verify(token, JWT_SECRET);
        // console.log('req.body is ', req.body);
        let newResponse = await Response.create({
            details, address, postId: req.body.postId, userId: verify.id, imageLink
        });

        await Post.findByIdAndUpdate(req.body.postId, {
            $push: {
                responses: newResponse._id
            }
        });

        return res.redirect('back');
    } catch (e) {
        console.log('error in adding response ', e);
        return res.redirect('back');
    }
});

userRoutes.get('/validateResponse/:responseId', async (req, res) => {
    try {
        let currResponse: any = await Response.findById(req.params.responseId);
        let currPost = await Post.findById(currResponse?.postId);
        let postUser = await User.findById(currPost?.userId);
        let token = req.cookies.token;
        const verify = jwt.verify(token, JWT_SECRET);

        if (verify.id == postUser?._id) {
            currResponse.isValid = true;
            await currResponse?.save();
        }
        return res.redirect('back');
    } catch (e) {
        console.log('error in validating ', e);
        return res.redirect('back');
    }
});


userRoutes.get('/allPosts', async (req, res) => {
    try {
        let postsData = await Post.find({ isActive: true });
        let updatedPostsData = await postDataFetcher(postsData);
        console.log('updated posts data is ', updatedPostsData);
        return res.render('user/allPosts', {
            data: updatedPostsData.activePosts
        });
    } catch (e) {
        console.log('error in getting posts', e);
        return res.redirect('back');
    }
});


userRoutes.get('/profile', async (req, res) => {
    try {
        let token = req.cookies.token;
        const verify = jwt.verify(token, JWT_SECRET);

        let currUser: any = await User.findById(verify.id);

        let responsesCount = await Response.find({ userId: currUser._id }).count();

        let finalObj = {
            name: currUser.name,
            contact: currUser.contact,
            email: currUser.email,
            noOfPosts: currUser.posts && currUser.posts.length,
            noOfResponses: responsesCount,
            dateAdded: dateParser(currUser.createdAt)
        };

        return res.render('user/profile', {
            data: finalObj
        });
    } catch (e) {
        console.log('error in rendering profile', e);
        return res.redirect('back')
    }
});


module.exports = userRoutes;
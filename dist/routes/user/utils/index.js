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
exports.responseDataFetcher = exports.postDataFetcher = void 0;
const dateParse_1 = __importDefault(require("../../../utils/dateParse"));
const userDataFetcher = (userData) => {
    try {
        let finalUserData = {
            name: userData.name,
            email: userData.email,
            contact: userData.contact || 'N/A'
        };
        return finalUserData;
    }
    catch (e) {
        console.log('error in fetching user data ', e);
        return {};
    }
};
const responseDataFetcher = (responsesData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let finalData = [];
        responsesData.map((responseData) => {
            let tempObj = {
                responseId: responseData._id,
                postId: responseData.postId,
                details: responseData.details,
                address: responseData.address,
                dateAdded: (0, dateParse_1.default)(responseData.createdAt),
                userId: userDataFetcher(responseData.userId),
                isValid: responseData.isValid,
                imageLink: responseData.imageLink || ''
            };
            finalData.push(tempObj);
        });
        return finalData;
    }
    catch (e) {
        console.log('error in manipulating resposne Data', e);
        return [];
    }
});
exports.responseDataFetcher = responseDataFetcher;
const postDataFetcher = (postsData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let finalData = { activePosts: [], locatedPosts: [] };
        postsData.map((postData) => {
            let { name, fatherName, age, imageLink, closeDate, city, state, locationOfMissing, dateOfMissing, isActive, isFound, responses, _id, createdAt } = postData;
            let tempObj = {
                name,
                fatherName,
                age,
                city,
                state,
                locationOfMissing,
                dateOfMissing,
                isActive,
                isFound,
                responsesCount: responses.length || 0,
                postId: _id,
                dateAdded: (0, dateParse_1.default)(createdAt),
                imageLink: imageLink || '',
                closeDate: closeDate || ''
            };
            tempObj.isFound ? finalData.locatedPosts.push(tempObj) : finalData.activePosts.push(tempObj);
        });
        return finalData;
    }
    catch (e) {
        console.log('error in fetching posts data', e);
        return { activePosts: [], locatedPosts: [] };
    }
});
exports.postDataFetcher = postDataFetcher;

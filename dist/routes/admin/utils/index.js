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
exports.userDataFetcher = void 0;
const dateParse_1 = __importDefault(require("../../../utils/dateParse"));
const utils_1 = require("../../user/utils");
const userDataFetcher = (usersData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let finalData = [];
        usersData.map((userData) => __awaiter(void 0, void 0, void 0, function* () {
            let tempObj = {
                userId: userData._id,
                name: userData.name,
                contact: userData.contact,
                email: userData.email,
                posts: yield (0, utils_1.postDataFetcher)(userData.posts),
                postsCount: userData.posts.length || 0,
                isActive: userData.isActive,
                isVerified: userData.isVerified,
                dateAdded: (0, dateParse_1.default)(userData.createdAt)
            };
            finalData.push(tempObj);
        }));
        return finalData;
    }
    catch (e) {
        console.log('error in getting admin users data ', e);
        return [];
    }
});
exports.userDataFetcher = userDataFetcher;

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
const query_1 = __importDefault(require("../../model/query"));
const homeRoutes = (0, express_1.Router)();
homeRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.render('home');
}));
homeRoutes.get('/about', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.render('home/about');
}));
homeRoutes.post('/submitQuery', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let newQuery = yield query_1.default.create({
            name: req.body.name,
            email: req.body.email,
            message: req.body.message
        });
        console.log('new query is ', newQuery);
        return res.redirect('back');
    }
    catch (e) {
        console.log('error in submitting query');
        return res.redirect('back');
    }
}));
module.exports = homeRoutes;

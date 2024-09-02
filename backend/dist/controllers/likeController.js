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
exports.unlikeMedia = exports.likeMedia = void 0;
const likesModel_1 = __importDefault(require("../models/likesModel"));
const mediaModel_1 = require("../models/mediaModel");
const catchAsync_1 = require("../utils/catchAsync");
const appError_1 = require("../utils/appError");
exports.likeMedia = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const mediaId = req.params.id;
    const existingLike = yield likesModel_1.default.findOne({ user: userId, media: mediaId });
    if (existingLike) {
        return next(new appError_1.AppError('You already liked this media.', 400));
    }
    // Create a new like
    const newLike = new likesModel_1.default({ user: userId, media: mediaId });
    yield newLike.save();
    // Increment the like counter in the MediaContent document
    yield mediaModel_1.MediaContent.findByIdAndUpdate(mediaId, { $inc: { likes: 1 } });
    res.status(201).json({ message: 'Media liked successfully.' });
}));
exports.unlikeMedia = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const mediaId = req.params.id;
    const like = yield likesModel_1.default.findOne({ user: userId, media: mediaId });
    if (!like) {
        return next(new appError_1.AppError('You have not liked this media.', 400));
    }
    // Remove the like
    yield like.remove();
    // Decrement the like counter in the MediaContent document
    yield mediaModel_1.MediaContent.findByIdAndUpdate(mediaId, { $inc: { likes: -1 } });
    res.status(200).json({ message: 'Media unliked successfully.' });
}));

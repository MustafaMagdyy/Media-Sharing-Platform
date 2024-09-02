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
exports.getAllMediaWithLikeStatus = exports.deleteOne = exports.updateOne = exports.getOne = exports.getAllMedia = exports.uploadMedia = exports.userCheck = exports.setUserIds = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const appError_1 = require("../utils/appError");
const mediaModel_1 = require("../models/mediaModel");
const likesModel_1 = __importDefault(require("../models/likesModel"));
const setUserIds = (req, res, next) => {
    if (!req.body.user)
        req.body.user = req.user.id;
    next();
};
exports.setUserIds = setUserIds;
exports.userCheck = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const media = yield mediaModel_1.MediaContent.findById(req.params.id);
    // Check if media exists and the user field is populated correctly
    if (!media || !req.user || !media.user.equals(req.user.id)) {
        return next(new appError_1.AppError("You are not the owner of this product", 401));
    }
    next();
}));
exports.uploadMedia = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    // Validate file type
    const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/mpeg'];
    if (!file || !validMimeTypes.includes(file.mimetype)) {
        return next(new appError_1.AppError('Invalid file type. Only images and videos are allowed.', 400));
    }
    const fileUrl = file.location; // Use 'location' provided by multer-s3
    if (!fileUrl) {
        return next(new appError_1.AppError('File upload failed', 400));
    }
    const newMedia = yield mediaModel_1.MediaContent.create({
        title: req.body.title,
        description: req.body.description,
        fileUrl: fileUrl,
        type: file.mimetype,
        likes: 0
    });
    res.status(201).json({
        status: 'success',
        data: newMedia
    });
}));
exports.getAllMedia = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    /* Fetch all media items from the database
    const allMedia = await MediaContent.find();
    // Send response with the fetched media items
    res.status(200).json({
      status: "success",
      data: {
        media: allMedia,
      },
    });*/
    const media = yield mediaModel_1.MediaContent.find();
    //console.log('getAllMedia response:', media); 
    res.status(200).json({
        status: 'success',
        data: media,
    });
}));
exports.getOne = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield mediaModel_1.MediaContent.findById(req.params.id).select('-user');
    if (!doc) {
        return next(new appError_1.AppError('No document found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    });
}));
exports.updateOne = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Remove the uploadDate from the update object if present
    const updateData = Object.assign({}, req.body);
    delete updateData.uploadDate;
    const updateMedia = yield mediaModel_1.MediaContent.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
    });
    if (!updateMedia) {
        return next(new appError_1.AppError('No document found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            data: updateMedia
        }
    });
}));
exports.deleteOne = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield mediaModel_1.MediaContent.findByIdAndDelete(req.params.id);
    if (!doc) {
        return next(new appError_1.AppError("No document found matching this ID", 404));
    }
    res.status(204).json({
        status: "success",
        data: null,
    });
}));
exports.getAllMediaWithLikeStatus = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const media = yield mediaModel_1.MediaContent.find();
    const mediaWithLikeStatus = yield Promise.all(media.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        const liked = yield likesModel_1.default.findOne({ user: userId, media: item._id });
        return Object.assign(Object.assign({}, item.toObject()), { liked: !!liked });
    })));
    res.status(200).json({
        status: 'success',
        data: mediaWithLikeStatus,
    });
}));

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
exports.updateMe = exports.getAllUsers = exports.getOne = exports.getMe = void 0;
const userModel_1 = require("../models/userModel");
const catchAsync_1 = require("../utils/catchAsync");
const appError_1 = require("../utils/appError");
exports.getMe = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield userModel_1.User.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    console.log(req.user);
    res.status(200).json({
        status: 'success',
        data: user,
    });
}));
exports.getOne = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let query = userModel_1.User.findById(req.params.id);
    const doc = yield query;
    if (!doc) {
        return next(new appError_1.AppError("No document found with that ID", 404));
    }
    res.status(200).json({
        status: "success",
        data: {
            data: doc,
        },
    });
}));
exports.getAllUsers = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const users = yield userModel_1.User.find({ _id: { $ne: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id } }).select('-password -__v');
    res.status(200).json({
        status: 'success',
        data: users,
    });
}));
exports.updateMe = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (req.body.password) {
        return next(new appError_1.AppError("This route is not for password updates. Please use /updateMyPassword.", 400));
    }
    // Update user document
    const updatedUser = yield userModel_1.User.findByIdAndUpdate((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, req.body, {
        new: true,
        runValidators: true,
    });
    // Respond with updated user data
    res.status(200).json({
        status: "success",
        data: {
            user: updatedUser,
        },
    });
}));

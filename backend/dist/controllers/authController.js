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
exports.logout = exports.updatePassword = exports.protect = exports.restrictTo = exports.login = exports.signup = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const userModel_1 = require("../models/userModel");
const catchAsync_1 = require("../utils/catchAsync");
const appError_1 = require("../utils/appError");
// Function to sign a JWT token with the provided user ID
const signToken = (id) => {
    return (0, jsonwebtoken_1.sign)({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
// Function to create and send a JWT token to the client
const createSendToken = (user, statusCode, req, res) => {
    const token = signToken(user._id);
    const expirationDuration = Number(process.env.JWT_COOKIE_EXPIRES_IN) || 604800000;
    if (isNaN(expirationDuration)) {
        throw new Error("JWT_COOKIE_EXPIRES_IN is not a valid number.");
    }
    const expiresDate = new Date(Date.now() + expirationDuration);
    const cookieOptions = {
        expires: expiresDate,
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
        sameSite: 'none',
    };
    res.cookie('jwt', token, cookieOptions);
    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};
exports.signup = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield userModel_1.User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });
    createSendToken(newUser, 201, req, res);
}));
exports.login = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new appError_1.AppError("Please provide email and password!", 400));
    }
    const user = yield userModel_1.User.findOne({ email }).select("+password");
    if (!user || !(yield user.correctPassword(password, user.password))) {
        return next(new appError_1.AppError("Incorrect email or password", 401));
    }
    createSendToken(user, 200, req, res);
}));
const jwtVerifyPromisified = (token, secret) => {
    return new Promise((resolve, reject) => {
        (0, jsonwebtoken_1.verify)(token, secret, {}, (err, payload) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(payload);
            }
        });
    });
};
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return next(new appError_1.AppError('The user is not authenticated', 401));
        }
        if (!roles.includes(req.user.role)) {
            return next(new appError_1.AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};
exports.restrictTo = restrictTo;
exports.protect = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    if (!token) {
        return next(new appError_1.AppError('You are not logged in! Please log in to get access.', 401));
    }
    const decoded = yield jwtVerifyPromisified(token, process.env.JWT_SECRET);
    const currentUser = yield userModel_1.User.findById(decoded.id);
    if (!currentUser) {
        return next(new appError_1.AppError('The user belonging to this token no longer exists.', 401));
    }
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new appError_1.AppError('User recently changed password! Please log in again.', 401));
    }
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
}));
exports.updatePassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield userModel_1.User.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id).select('+password');
    if (!(yield user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new appError_1.AppError('Your current password is wrong.', 401));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    yield user.save();
    createSendToken(user, 200, req, res);
}));
exports.logout = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie('jwt', '', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
        sameSite: 'none',
        path: '/'
    });
    res.status(200).json({
        status: 'success',
        message: 'Logged out successfully',
    });
}));

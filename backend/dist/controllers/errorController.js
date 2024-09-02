"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = require("../utils/appError");
// Handle CastError from MongoDB
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new appError_1.AppError(message, 400);
};
// Handle duplicate field errors from MongoDB
const handleDuplicateFieldsDB = (err) => {
    const value = Object.values(err.keyValue)[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new appError_1.AppError(message, 400);
};
// Handle validation errors from MongoDB
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join(". ")}`;
    return new appError_1.AppError(message, 400);
};
// Handle invalid JSON Web Token error
const handleJWTError = () => {
    return new appError_1.AppError("Invalid login. Please login again.", 401);
};
// Handle expired JSON Web Token error
const handleJWTExpiredError = () => {
    return new appError_1.AppError("Token expired. Please login again.", 401);
};
// Function to send error response in development environment
const sendErrorDev = (err, req, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};
// Function to send error response in production environment
const sendErrorProd = (err, req, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
        // Programming or other unknown error: don't leak error details
    }
    else {
        console.error("ERROR 💥", err);
        res.status(500).json({
            status: "error",
            message: "Something went very wrong!",
        });
    }
};
// Global error handling middleware
const errorHandler = (err, req, res, next) => {
    const error = err;
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";
    if (process.env.NODE_ENV === "development") {
        sendErrorDev(error, req, res);
    }
    else if (process.env.NODE_ENV === "production") {
        let handledError = Object.assign({}, error);
        handledError.message = error.message;
        if (handledError.name === "CastError")
            handledError = handleCastErrorDB(handledError);
        if (handledError.statusCode === 11000)
            handledError = handleDuplicateFieldsDB(handledError);
        if (handledError.name === "ValidationError")
            handledError = handleValidationErrorDB(handledError);
        if (handledError.name === "JsonWebTokenError")
            handledError = handleJWTError();
        if (handledError.name === "TokenExpiredError")
            handledError = handleJWTExpiredError();
        sendErrorProd(handledError, req, res);
    }
};
exports.default = errorHandler;

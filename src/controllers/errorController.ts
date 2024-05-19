import { AppError } from "../utils/appError";
import { Request, Response, NextFunction } from "express";
// Handle CastError from MongoDB
const handleCastErrorDB = (err: any): AppError => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

// Handle duplicate field errors from MongoDB
const handleDuplicateFieldsDB = (err: any): AppError => {
  const value = Object.values(err.keyValue)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

// Handle validation errors from MongoDB
const handleValidationErrorDB = (err: any): AppError => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

// Handle invalid JSON Web Token error
const handleJWTError = (): AppError => {
  return new AppError("Invalid login. Please login again.", 401);
};

// Handle expired JSON Web Token error
const handleJWTExpiredError = (): AppError => {
  return new AppError("Token expired. Please login again.", 401);
};

// Function to send error response in development environment
const sendErrorDev = (err: AppError, req: Request, res: Response): void => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// Function to send error response in production environment
const sendErrorProd = (err: AppError, req: Request, res: Response): void => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Programming or other unknown error: don't leak error details
  } else {
    console.error("ERROR 💥", err);
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

// Global error handling middleware
const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = err as AppError;
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(error, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let handledError = { ...error };
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

export default errorHandler;

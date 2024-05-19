import { IUser, User } from "../models/userModel";
import { sign, verify as verifyJWT } from "jsonwebtoken";
import { promisify } from "util";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/appError";
import { RequestHandler, Request, Response,NextFunction } from "express";
import { CustomRequest } from "../interfaces/customRequest";
import {
  DecodedToken,
  LoginBody,
  SignupBody,
} from "../interfaces/userInterface";
import { MediaContent } from "../models/mediaModel";
export const getMe: RequestHandler = catchAsync(
    async (req: CustomRequest, res: Response, next) => {
      const user = await User.findById(req.user?.id);
      console.log(req.user);
      res.status(200).json({
        status: 'success',
        data: user,
      });
    }
  );
  export const getOne:RequestHandler = catchAsync(async (req: CustomRequest, res: Response, next) => {
      let query = User.findById(req.params.id);
      const doc = await query;
  
      if (!doc) {
        return next(new AppError("No document found with that ID", 404));
      }
  
      res.status(200).json({
        status: "success",
        data: {
          data: doc,
        },
      });
    });
  export const getAllUsers: RequestHandler = catchAsync(
    async (req: CustomRequest, res: Response, next) => {
      const users = await User.find({ _id: { $ne: req.user?.id } }).select(
        '-password -__v'
      );
  
      res.status(200).json({
        status: 'success',
        data: users,
      });
    }
  );


   export const updateMe : RequestHandler = catchAsync(async (req: CustomRequest, res: Response, next) => {
    if (req.body.password) {
      return next(
        new AppError(
          "This route is not for password updates. Please use /updateMyPassword.",
          400
        )
      );
    }

    // Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user?.id, req.body, {
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
  });

  
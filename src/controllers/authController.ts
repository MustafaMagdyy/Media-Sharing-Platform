import { RequestHandler, Request, Response, NextFunction } from "express";
import { sign, verify as verifyJWT } from "jsonwebtoken";
import { promisify } from "util";
import { IUser, User } from "../models/userModel";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/appError";
import { CustomRequest } from "../interfaces/customRequest";
import { DecodedToken, LoginBody, SignupBody } from "../interfaces/userInterface";

// Function to sign a JWT token with the provided user ID
const signToken = (id: string): string => {
  return sign(
    { id },
    process.env.JWT_SECRET!,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

// Function to create and send a JWT token to the client
const createSendToken = (
  user: any,
  statusCode: number,
  req: Request,
  res: Response
): void => {
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
    sameSite: 'none' as 'none', 
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


export const signup: RequestHandler = catchAsync(
  async (req: CustomRequest<SignupBody>, res, next) => {
    const newUser: IUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    createSendToken(newUser, 201, req, res);
  }
);


export const login: RequestHandler = catchAsync(
  async (req: CustomRequest<LoginBody>, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Please provide email and password!", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Incorrect email or password", 401));
    }

    createSendToken(user, 200, req, res);
  }
);


const jwtVerifyPromisified = (token: string, secret: string): Promise<DecodedToken> => {
  return new Promise((resolve, reject) => {
    verifyJWT(token, secret, {}, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload as DecodedToken);
      }
    });
  });
};


type Middleware = (req: CustomRequest, res: Response, next: NextFunction) => void;

export const restrictTo = (...roles: string[]): Middleware => {
  return (req: CustomRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !req.user.role) {
      return next(new AppError('The user is not authenticated', 401));
    }
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
  };
};


export const protect: RequestHandler = catchAsync(
  async (req: CustomRequest, res, next) => {
    let token;
    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    const decoded = await jwtVerifyPromisified(token, process.env.JWT_SECRET!);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(new AppError('User recently changed password! Please log in again.', 401));
    }

    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  }
);


export const updatePassword: RequestHandler = catchAsync(
  async (req: CustomRequest, res, next) => {
    const user = await User.findById(req.user?.id).select('+password');

    if (!(await user!.correctPassword(req.body.passwordCurrent, user!.password))) {
      return next(new AppError('Your current password is wrong.', 401));
    }

    user!.password = req.body.password;
    user!.passwordConfirm = req.body.passwordConfirm;
    await user!.save();

    createSendToken(user, 200, req, res);
  }
);


export const logout: RequestHandler = catchAsync(
  async (req: Request, res: Response, next) => {
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
  }
);

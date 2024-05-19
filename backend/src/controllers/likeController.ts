import Like from "../models/likesModel";
import { MediaContent } from "../models/mediaModel";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/appError";
import { RequestHandler } from "express";
import { CustomRequest } from "../interfaces/customRequest";

export const likeMedia: RequestHandler = catchAsync(
  async (req: CustomRequest, res, next) => {
    const userId = req.user?._id;
    const mediaId = req.params.id;

    const existingLike = await Like.findOne({ user: userId, media: mediaId });
    if (existingLike) {
      return next(new AppError('You already liked this media.', 400));
    }

    // Create a new like
    const newLike = new Like({ user: userId, media: mediaId });
    await newLike.save();

    // Increment the like counter in the MediaContent document
    await MediaContent.findByIdAndUpdate(mediaId, { $inc: { likes: 1 } });

    res.status(201).json({ message: 'Media liked successfully.' });
  }
);

export const unlikeMedia: RequestHandler = catchAsync(
  async (req: CustomRequest, res, next) => {
    const userId = req.user?._id;
    const mediaId = req.params.id;

    const like = await Like.findOne({ user: userId, media: mediaId });
    if (!like) {
      return next(new AppError('You have not liked this media.', 400));
    }

    // Remove the like
    await like.remove();

    // Decrement the like counter in the MediaContent document
    await MediaContent.findByIdAndUpdate(mediaId, { $inc: { likes: -1 } });

    res.status(200).json({ message: 'Media unliked successfully.' });
  }
);

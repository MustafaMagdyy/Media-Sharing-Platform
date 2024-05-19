import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/appError";
import { MediaContent } from "../models/mediaModel";
import { UploadMediaRequest } from "../interfaces/mediaInterfaces";
import { CustomRequest } from "../interfaces/customRequest";
import { RequestHandler, Request, Response,NextFunction } from "express";
import Like from '../models/likesModel';
export const setUserIds:RequestHandler = (req: CustomRequest, res: Response, next: NextFunction) => {
  if (!req.body.user) req.body.user = req.user!.id;
  next();
};
export const userCheck:RequestHandler = catchAsync(async (req: CustomRequest, res: Response, next) => {
  const media = await MediaContent.findById(req.params.id);

  // Check if media exists and the user field is populated correctly
  if (!media || !req.user || !media.user.equals(req.user.id)) {
    return next(new AppError("You are not the owner of this product", 401));
  }

  next();
});
export const uploadMedia: RequestHandler = catchAsync(
  async (req: CustomRequest, res, next) => {
    const file = req.file as any;

    // Validate file type
    const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/mpeg'];
    if (!file || !validMimeTypes.includes(file.mimetype)) {
      return next(new AppError('Invalid file type. Only images and videos are allowed.', 400));
    }

    const fileUrl = file.location;  // Use 'location' provided by multer-s3
    if (!fileUrl) {
      return next(new AppError('File upload failed', 400));
    }

    const newMedia = await MediaContent.create({
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
  }
);
export const getAllMedia: RequestHandler = catchAsync(
  async (req, res, next) => {
    /* Fetch all media items from the database
    const allMedia = await MediaContent.find();
    // Send response with the fetched media items
    res.status(200).json({
      status: "success",
      data: {
        media: allMedia,
      },
    });*/
    const media = await MediaContent.find();
    //console.log('getAllMedia response:', media); 
    res.status(200).json({
      status: 'success',
      data: media,
    });
  }
);
export const getOne: RequestHandler =catchAsync(
  async (req, res, next) => {

    const doc = await MediaContent.findById(req.params.id).select('-user');

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });
  
  export const updateOne:RequestHandler = 
  catchAsync(async (req: CustomRequest, res: Response, next) => {
    // Remove the uploadDate from the update object if present
    const updateData = {...req.body};
    delete updateData.uploadDate;

    const updateMedia = await MediaContent.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updateMedia) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: updateMedia
      }
    });
  });
  export const deleteOne:RequestHandler = 
    catchAsync(async (req, res, next) => {
      const doc = await MediaContent.findByIdAndDelete(req.params.id);
      if (!doc) {
        return next(new AppError("No document found matching this ID", 404));
      }
      res.status(204).json({
        status: "success",
        data: null,
      });
    });

    export const getAllMediaWithLikeStatus: RequestHandler = catchAsync(
      async (req: CustomRequest, res, next) => {
        const userId = req.user?._id;
    
        const media = await MediaContent.find();
    
        const mediaWithLikeStatus = await Promise.all(
          media.map(async (item) => {
            const liked = await Like.findOne({ user: userId, media: item._id });
            return { ...item.toObject(), liked: !!liked };
          })
        );
    
        res.status(200).json({
          status: 'success',
          data: mediaWithLikeStatus,
        });
      }
    );
    
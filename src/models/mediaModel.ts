import mongoose, { Document, Schema } from "mongoose";

export enum MediaType {
  IMAGE = "image",
  VIDEO = "video",
}

export interface MediaContent extends Document {
  _id: string;
  title: string;
  description: string;
  fileUrl: string;
  type: MediaType;
  uploadDate: Date;
  likes: number;
  user: mongoose.Types.ObjectId;
}

const MediaContentSchema: Schema<MediaContent> = new Schema({
  title: {
    type: String,
    required: [true, "Media must have a title"],
  },
  description: {
    type: String,
    required: [true, "Media must have a description"],
  },
  fileUrl: {
    type: String,
    required: [true, "Media must have a URL"],
  },
  type: {
    type: String,
    required: [true, 'A media must have a type'],
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    active: false,
  },
},
{
  // Virtual properties to include when converting to JSON/Object
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});
MediaContentSchema.pre<MediaContent>(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "email",
  });
  next();
});

export const MediaContent = mongoose.model<MediaContent>(
  "MediaContent",
  MediaContentSchema
);
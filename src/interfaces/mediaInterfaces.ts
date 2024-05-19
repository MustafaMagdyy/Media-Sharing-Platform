import { MediaType } from "../models/mediaModel";
import mongoose from "mongoose";
export interface UploadMediaRequest {
  title: string;
  description: string;
  fileUrl: string;
  type: MediaType;
  uploadDate: Date;
  likes: number;
  user: mongoose.Types.ObjectId;
}

import { Request } from "express";
import { IUser } from "../models/userModel";
import { MediaContent } from "../models/mediaModel";


export interface CustomRequest<T = any> extends Request {
  body: T;
  user?: IUser;
  media?: MediaContent;
  file?: Express.Multer.File;

}

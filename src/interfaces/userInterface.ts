import { JwtPayload } from "jsonwebtoken";
import { IUser } from "../models/userModel";

export interface SignupBody {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface ProtectBody {
  user: IUser;
}

export interface DecodedToken extends JwtPayload {
  id: string;
  iat: number;
  exp: number;
}
export interface RestrictTo {
  user: IUser;
}
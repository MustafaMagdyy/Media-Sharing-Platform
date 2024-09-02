import express from "express";
import morgan from "morgan";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mediaRouter from "./routes/mediaRoutes";
import cors from "cors";
import userRouter from "./routes/userRoutes";
import errorHandler from "./controllers/errorController";
import fileUpload from 'express-fileupload';
import path from "path";
const app = express();

if (process.env.NODE_ENV === "development") {

  app.use(morgan("dev"));
}

app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:8081',
  ],
  
  credentials: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(cookieParser());

app.use("/v1/media", mediaRouter);
app.use("/v1/user", userRouter);
app.use(errorHandler);
export default app;

import mongoose from "mongoose";
import dotenv from "dotenv";
import http from 'http';
import fileUpload from 'express-fileupload';
// Setting up environment variables
dotenv.config({ path: "./config.env" });
import app from "./app";
import { Console } from "console";
const port = process.env.PORT || 5000;
const server = http.createServer(app);
// Connecting to MongoDB
const mongoDB = process.env.DATABASE?.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD || ""
);
if (mongoDB) {
  mongoose
    .connect(mongoDB)
    .then(() => {
      console.log("DB connection successful!");
    })
    .catch((err) => {
      console.error("DB connection error:", err);
    });
} else {
  console.error("MongoDB URI is not defined");
}

// Starting the server
/*const server = app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});*/
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
// Setting up environment variables
dotenv_1.default.config({ path: "./config.env" });
const app_1 = __importDefault(require("./app"));
const port = process.env.PORT || 5000;
const server = http_1.default.createServer(app_1.default);
// Connecting to MongoDB
const mongoDB = (_a = process.env.DATABASE) === null || _a === void 0 ? void 0 : _a.replace("<PASSWORD>", process.env.DATABASE_PASSWORD || "");
if (mongoDB) {
    mongoose_1.default
        .connect(mongoDB)
        .then(() => {
        console.log("DB connection successful!");
    })
        .catch((err) => {
        console.error("DB connection error:", err);
    });
}
else {
    console.error("MongoDB URI is not defined");
}
// Starting the server
/*const server = app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});*/
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

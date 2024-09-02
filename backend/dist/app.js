"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mediaRoutes_1 = __importDefault(require("./routes/mediaRoutes"));
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const errorController_1 = __importDefault(require("./controllers/errorController"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
if (process.env.NODE_ENV === "development") {
    app.use((0, morgan_1.default)("dev"));
}
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:3000',
        'http://localhost:8081',
    ],
    credentials: true
}));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/v1/media", mediaRoutes_1.default);
app.use("/v1/user", userRoutes_1.default);
app.use(errorController_1.default);
exports.default = app;

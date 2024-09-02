"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaContent = exports.MediaType = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var MediaType;
(function (MediaType) {
    MediaType["IMAGE"] = "image";
    MediaType["VIDEO"] = "video";
})(MediaType || (exports.MediaType = MediaType = {}));
const MediaContentSchema = new mongoose_1.Schema({
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Users",
        active: false,
    },
}, {
    // Virtual properties to include when converting to JSON/Object
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
MediaContentSchema.pre(/^find/, function (next) {
    this.populate({
        path: "user",
        select: "email",
    });
    next();
});
exports.MediaContent = mongoose_1.default.model("MediaContent", MediaContentSchema);

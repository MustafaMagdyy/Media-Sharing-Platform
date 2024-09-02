"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mediaController_1 = require("../controllers/mediaController");
const authController_1 = require("../controllers/authController");
const likeController_1 = require("../controllers/likeController");
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const client_s3_1 = require("@aws-sdk/client-s3");
//console.log('AWS xS3 Bucket Name:', process.env.PORT);
const router = (0, express_1.Router)();
const s3 = new client_s3_1.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
const upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET_NAME,
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            cb(null, Date.now().toString() + '-' + file.originalname);
        },
    }),
});
//router.post('/', upload.single('photo'), uploadMedia);
router.get('/', mediaController_1.getAllMediaWithLikeStatus);
router.get('/:id', mediaController_1.getOne);
router.patch('/:id', authController_1.protect, mediaController_1.updateOne);
router.delete('/:id', authController_1.protect, mediaController_1.deleteOne);
router.post('/like/:id', authController_1.protect, likeController_1.likeMedia);
router.delete('/like/:id', authController_1.protect, likeController_1.unlikeMedia);
exports.default = router;

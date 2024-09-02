import { Router } from 'express';
import { uploadMedia, getAllMediaWithLikeStatus, getOne, updateOne, deleteOne } from '../controllers/mediaController';
import { protect } from '../controllers/authController';
import { likeMedia, unlikeMedia } from '../controllers/likeController';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
//console.log('AWS xS3 Bucket Name:', process.env.PORT);
const router = Router();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME!,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, Date.now().toString() + '-' + file.originalname);
    },
  }),
});

//router.post('/', upload.single('photo'), uploadMedia);
router.get('/',  getAllMediaWithLikeStatus); 
router.get('/:id', getOne);
router.patch('/:id', protect, updateOne);
router.delete('/:id', protect, deleteOne);
router.post('/like/:id', protect, likeMedia);
router.delete('/like/:id', protect, unlikeMedia);

export default router;

const express = require('express');
const multer = require('multer');
const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');
const path = require('path');
const { uploadImage } = require('../controllers/uploadController');

const router = express.Router();

let upload;

if (process.env.STORAGE_TYPE === 's3') {
  console.log('[Upload] Using AWS S3 Storage (Manual Upload)');
  upload = multer({ 
    storage: multer.memoryStorage(),
    fileFilter: function (req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    }
  });
} else {
  console.log('[Upload] Using Local Disk Storage');
  // Local Disk Storage Config
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, `payments-${Date.now()}${path.extname(file.originalname)}`);
    }
  });

  upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    }
  });
}

// Error handling wrapper for multer
const uploadSingle = (req, res, next) => {
  const uploadHandler = upload.single('image');
  
  uploadHandler(req, res, function (err) {
    if (err) {
      console.error('[Upload] Error:', err.message);
      return res.status(400).json({ 
        success: false, 
        error: err.message,
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined 
      });
    }
    next();
  });
};

router.post('/', uploadSingle, uploadImage);

module.exports = router;

const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// @desc    Upload image
// @route   POST /api/upload
// @access  Public
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    let imageUrl = '';

    if (process.env.STORAGE_TYPE === 's3') {
      const file = req.file;
      const { userId, orderId } = req.body;
      const time = Date.now();
      
      // Construct filename: {user_id}-{time}-{order_id}
      // Sanitize inputs to avoid issues with S3 keys
      const safeUserId = (userId || 'unknown').replace(/[^a-z0-9]/gi, '_');
      const safeOrderId = (orderId || 'pending').replace(/[^a-z0-9]/gi, '_');
      const extension = path.extname(file.originalname) || '.jpg';
      
      const fileName = `payments/${safeUserId}-${time}-${safeOrderId}${extension}`;

      const s3 = new S3Client({
        region: process.env.REGION,
        credentials: {
          accessKeyId: process.env.ACCESS_KEY,
          secretAccessKey: process.env.SECRET_KEY,
        },
      });

      const command = new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await s3.send(command);

      imageUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.REGION}.amazonaws.com/${fileName}`;
    } else {
      // construction for local storage
      const baseUrl = process.env.BASE_URL || 'http://localhost:5001';
      // req.file.path is usually 'uploads/filename.ext'
      // server.js serves 'uploads' folder at '/uploads'
      const fileName = path.basename(req.file.path);
      imageUrl = `${baseUrl}/uploads/${fileName}`;
    }

    res.status(200).json({
      success: true,
      data: imageUrl
    });
  } catch (error) {
    console.error('[Upload] Controller Error:', error);
    res.status(500).json({ success: false, error: 'Upload failed', message: error.message });
  }
};

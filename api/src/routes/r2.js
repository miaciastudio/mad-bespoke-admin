import { Router } from 'express';
import multer from 'multer';
import { uploadToR2, generatePresignedUploadUrl, getObjectFromR2, BUCKET_NAME } from '../services/r2.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
});

// POST /api/upload (Direct Admin Upload to Cloudflare R2)
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }

    const ext = req.file.originalname.split('.').pop() || 'jpg';
    const cleanBase = req.file.originalname
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');
    const key = `products/${cleanBase}-${Date.now()}.${ext}`;

    const mediaUrl = await uploadToR2(req.file.buffer, key, req.file.mimetype || 'image/jpeg');

    res.json({
      success: true,
      url: mediaUrl,
      key,
      bucket: BUCKET_NAME,
      provider: 'Cloudflare R2',
    });
  } catch (error) {
    console.error('R2 upload error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/r2/presign (Generates presigned upload URL for direct browser -> R2 upload)
router.post('/r2/presign', async (req, res) => {
  try {
    const { filename = 'image.jpg', contentType = 'image/jpeg' } = req.body;
    const ext = filename.split('.').pop() || 'jpg';
    const key = `products/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

    const presigned = await generatePresignedUploadUrl(key, contentType);
    res.json({
      success: true,
      ...presigned,
      provider: 'Cloudflare R2',
    });
  } catch (error) {
    console.error('Presigned URL error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/media/* (Secure Streaming Proxy for Private R2 Bucket Media)
router.get('/media/*', async (req, res) => {
  try {
    const key = req.params[0];
    if (!key) {
      return res.status(400).send('Missing media key');
    }

    const object = await getObjectFromR2(key);

    if (object.ContentType) {
      res.setHeader('Content-Type', object.ContentType);
    }
    if (object.ContentLength) {
      res.setHeader('Content-Length', object.ContentLength);
    }
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

    // Pipe the S3 readable stream to response
    object.Body.pipe(res);
  } catch (error) {
    if (error.name === 'NoSuchKey' || error.$metadata?.httpStatusCode === 404) {
      return res.status(404).send('Media not found in R2');
    }
    console.error('R2 media proxy error:', error);
    res.status(500).send('Error streaming media from R2');
  }
});

// GET /api/r2/status
router.get('/r2/status', (req, res) => {
  res.json({
    success: true,
    provider: 'Cloudflare R2',
    bucket: BUCKET_NAME,
    status: 'configured',
  });
});

export default router;

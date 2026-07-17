import { Router, Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const router = Router();

const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

function publicUrl(req: Request, filename: string): string {
  const base = process.env.PUBLIC_URL || `${req.protocol}://${req.get('host')}`;
  return `${base}/uploads/${filename}`;
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `asset_${Date.now()}_${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (_req: Request, file: any, cb: any) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Invalid file type. Only image files (JPEG, PNG, WebP) are allowed.'));
    }
    cb(null, true);
  },
});

// ─── Legacy upload via base64/data URL ─────────────────────────
router.post('/image', async (req: Request, res: Response) => {
  try {
    const { image } = req.body;

    if (!image) {
      res.status(400).json({ success: false, message: 'Image data is required (base64 or data URL).' });
      return;
    }

    const match = /^data:(image\/(\w+));base64,(.+)$/.exec(image);
    if (!match) {
      res.status(400).json({ success: false, message: 'Only base64 data URLs are supported.' });
      return;
    }

    const ext = match[2] === 'jpeg' ? 'jpg' : match[2];
    const buffer = Buffer.from(match[3], 'base64');
    const filename = `asset_${Date.now()}_${Math.round(Math.random() * 1e9)}.${ext}`;
    fs.writeFileSync(path.join(UPLOAD_DIR, filename), buffer);

    res.json({
      success: true,
      url: publicUrl(req, filename),
      publicId: filename,
    });
  } catch (err: any) {
    console.error('[POST /upload/image]', err);
    res.status(500).json({ success: false, message: err.message || 'Upload failed.' });
  }
});

// ─── Multer Multipart upload ──────────────────────
// Receives image data uploaded directly from the React Native device as FormData.
router.post('/asset', (req: Request, res: Response) => {
  upload.single('image')(req, res, (err: any) => {
    if (err) {
      console.error('[POST /upload/asset] Multer upload failed:', err);

      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'Image file size is too large. Maximum file size is 10MB.',
        });
      }

      return res.status(400).json({
        success: false,
        message: err.message || 'Failed to upload asset image.',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided. Please attach an image under the form key "image".',
      });
    }

    const fileData = req.file as Express.Multer.File;

    res.json({
      success: true,
      url: publicUrl(req, fileData.filename),
      publicId: fileData.filename,
    });
  });
});

export default router;

import { Router, Request, Response } from 'express';
import cloudinary from '../lib/cloudinary.js';

const router = Router();

router.post('/image', async (req: Request, res: Response) => {
  try {
    const { image, folder, publicId } = req.body;

    if (!image) {
      res.status(400).json({ success: false, message: 'Image data is required (base64, URL, or file path).' });
      return;
    }

    const options: any = {
      folder: folder || 'otulia_listings',
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    if (publicId) {
      options.public_id = publicId;
    }

    const result = await cloudinary.uploader.upload(image, options);

    res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
    });
  } catch (err: any) {
    console.error('[POST /upload/image]', err);
    res.status(500).json({ success: false, message: err.message || 'Upload failed.' });
  }
});

export default router;

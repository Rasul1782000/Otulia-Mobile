import { Router, Request, Response } from 'express';

const router = Router();

router.post('/image', async (req: Request, res: Response) => {
  try {
    const { image, folder } = req.body;

    if (!image) {
      res.status(400).json({ success: false, message: 'Image data is required (base64).' });
      return;
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      res.status(500).json({ success: false, message: 'Cloudinary not configured.' });
      return;
    }

    const formData = new URLSearchParams();
    formData.append('file', image);
    formData.append('upload_preset', 'otulia_unsigned');
    formData.append('folder', folder || 'otulia_listings');

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: formData }
    );
    const result: any = await uploadRes.json();

    if (result.error) {
      res.status(400).json({ success: false, message: result.error.message });
      return;
    }

    res.json({ success: true, url: result.secure_url, publicId: result.public_id });
  } catch (err: any) {
    console.error('[POST /upload/image]', err);
    res.status(500).json({ success: false, message: err.message || 'Upload failed.' });
  }
});

export default router;

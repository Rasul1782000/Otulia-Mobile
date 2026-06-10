import { Router, Request, Response } from 'express';

const router = Router();

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

router.post('/send', async (req: Request, res: Response) => {
  try {
    const { to, subject, html }: EmailPayload = req.body;

    if (!to || !subject || !html) {
      res.status(400).json({ success: false, message: 'to, subject and html are required.' });
      return;
    }

    const user = process.env.EMAIL_USER || 'support@otulia.com';
    const pass = process.env.EMAIL_PASS || '';
    const host = process.env.EMAIL_HOST || 'smtp.hostinger.com';
    const port = parseInt(process.env.EMAIL_PORT || '465', 10);

    const nodemailer = (await import('nodemailer')).default;
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const info = await transporter.sendMail({
      from: `"Otulia" <${user}>`,
      to,
      subject,
      html,
    });

    console.log(`[EMAIL] Sent to ${to}: ${info.messageId}`);
    res.json({ success: true, message: 'Email sent.', messageId: info.messageId });
  } catch (err: any) {
    console.error('[POST /email/send]', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to send email.' });
  }
});

export default router;

import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth.js';
import { emailLimiter } from '../middleware/rateLimit.js';

const router = Router();

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DANGEROUS_TAGS = /<script[\s>]|<iframe[\s>]|<object[\s>]|<embed[\s>]|<form[\s>]/gi;

function sanitizeHtml(html: string): string {
  return html.replace(DANGEROUS_TAGS, (match) => `<!-- removed ${match.trim()} -->`);
}

function sanitizeInput(value: string, maxLength: number): string {
  return value.trim().substring(0, maxLength);
}

router.post('/send', authenticate, emailLimiter, async (req: Request, res: Response) => {
  try {
    let { to, subject, html }: EmailPayload = req.body;

    if (!to || !subject || !html) {
      res.status(400).json({ success: false, message: 'to, subject and html are required.' });
      return;
    }

    to = sanitizeInput(to, 254);
    subject = sanitizeInput(subject, 998);

    if (!EMAIL_REGEX.test(to)) {
      res.status(400).json({ success: false, message: 'Invalid email address format.' });
      return;
    }

    if (subject.length === 0) {
      res.status(400).json({ success: false, message: 'Subject cannot be empty.' });
      return;
    }

    html = sanitizeHtml(html);

    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    const host = process.env.EMAIL_HOST;
    const port = parseInt(process.env.EMAIL_PORT || '465', 10);

    if (!user || !pass || !host) {
      res.status(503).json({ success: false, message: 'Email is not configured. Set EMAIL_USER, EMAIL_PASS, and EMAIL_HOST.' });
      return;
    }

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

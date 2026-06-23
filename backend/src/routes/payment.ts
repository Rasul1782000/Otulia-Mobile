import { Router, Request, Response } from 'express';
import { paymentLimiter } from '../middleware/rateLimit.js';

const router = Router();

router.post('/create', paymentLimiter, async (req: Request, res: Response) => {
  try {
    const { amount, currency, description } = req.body;

    if (!amount) {
      res.status(400).json({ success: false, message: 'Amount is required.' });
      return;
    }

    const numAmount = parseFloat(String(amount));
    if (isNaN(numAmount) || numAmount <= 0) {
      res.status(400).json({ success: false, message: 'Amount must be a positive number.' });
      return;
    }

    const clientId = process.env.PAYPAL_CLIENT_ID || '';
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET || '';

    if (!clientId || !clientSecret) {
      res.status(503).json({ success: false, message: 'PayPal not configured.' });
      return;
    }

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const tokenRes = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    const tokenData: any = await tokenRes.json();
    const accessToken = tokenData.access_token;

    const orderRes = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          description: description || 'Otulia Luxury Purchase',
          amount: { currency_code: currency || 'EUR', value: String(amount) },
        }],
      }),
    });
    const order: any = await orderRes.json();

    res.json({ success: true, orderId: order.id, status: order.status });
  } catch (err: any) {
    console.error('[POST /payment/create]', err);
    res.status(500).json({ success: false, message: err.message || 'Payment creation failed.' });
  }
});

router.post('/capture', paymentLimiter, async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      res.status(400).json({ success: false, message: 'orderId is required.' });
      return;
    }

    if (typeof orderId !== 'string' || orderId.trim().length === 0) {
      res.status(400).json({ success: false, message: 'orderId must be a non-empty string.' });
      return;
    }

    const clientId = process.env.PAYPAL_CLIENT_ID || '';
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET || '';

    if (!clientId || !clientSecret) {
      res.status(503).json({ success: false, message: 'PayPal not configured.' });
      return;
    }

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const tokenRes = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    const tokenData: any = await tokenRes.json();

    if (!tokenData.access_token) {
      res.status(502).json({ success: false, message: 'Failed to obtain PayPal access token.' });
      return;
    }

    const captureRes = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
      },
    });
    const capture: any = await captureRes.json();

    if (!captureRes.ok || capture.error) {
      const errMsg = capture.error?.message || capture.message || 'PayPal capture failed';
      res.status(captureRes.status || 502).json({ success: false, message: errMsg, details: capture });
      return;
    }

    res.json({ success: true, capture });
  } catch (err: any) {
    console.error('[POST /payment/capture]', err);
    res.status(500).json({ success: false, message: err.message || 'Capture failed.' });
  }
});

export default router;

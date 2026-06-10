import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_dev_secret';

function generateToken(userId: number, email: string): string {
  return jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '7d' });
}

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
      res.status(400).json({ success: false, message: 'All fields are required.' });
      return;
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      res.status(409).json({ success: false, message: 'An account with this email already exists.' });
      return;
    }

    const hashed = await bcrypt.hash(password, 12);
    const stmt = db.prepare('INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)');
    const result = stmt.run(full_name, email, hashed);
    const token = generateToken(result.lastInsertRowid as number, email);

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: {
        id: result.lastInsertRowid,
        full_name,
        email,
      },
    });
  } catch (err) {
    console.error('[POST /auth/register]', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    const user = db
      .prepare('SELECT id, full_name, email, password, created_at FROM users WHERE email = ?')
      .get(email) as { id: number; full_name: string; email: string; password: string; created_at: string } | undefined;

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const token = generateToken(user.id, user.email);

    res.json({
      success: true,
      message: 'Signed in successfully.',
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        created_at: user.created_at,
      },
    });
  } catch (err) {
    console.error('[POST /auth/login]', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

router.post('/google', async (req: Request, res: Response) => {
  try {
    const { email, full_name, googleId } = req.body;

    if (!email || !full_name) {
      res.status(400).json({ success: false, message: 'Email and name are required.' });
      return;
    }

    let user = db
      .prepare('SELECT id, full_name, email, created_at FROM users WHERE email = ?')
      .get(email) as { id: number; full_name: string; email: string; created_at: string } | undefined;

    if (!user) {
      const placeholderPassword = await bcrypt.hash(googleId || email + Date.now(), 12);
      const stmt = db.prepare('INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)');
      const result = stmt.run(full_name, email, placeholderPassword);
      user = { id: result.lastInsertRowid as number, full_name, email, created_at: new Date().toISOString() };
    }

    const token = generateToken(user.id, user.email);

    res.json({
      success: true,
      message: 'Signed in with Google.',
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        created_at: user.created_at,
      },
    });
  } catch (err) {
    console.error('[POST /auth/google]', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

router.get('/users', (_req: Request, res: Response) => {
  try {
    const users = db
      .prepare('SELECT id, full_name, email, created_at FROM users ORDER BY created_at DESC')
      .all();
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    console.error('[GET /auth/users]', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

export default router;

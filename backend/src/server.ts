import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
import emailRouter from "./routes/email.js";
import paymentRouter from "./routes/payment.js";
import uploadRouter from "./routes/upload.js";
import listingsRouter from "./routes/listings.js";
import path from "path";
import "./db.js";

const requiredEnvVars = [
  'JWT_SECRET',
];

const missing = requiredEnvVars.filter(v => !process.env[v]);
if (missing.length > 0) {
  console.error(`[Server] Missing required environment variables: ${missing.join(', ')}`);
  console.error('[Server] Set these in your .env file before starting the server.');
  process.exit(1);
}

const app = express();
const PORT = parseInt(process.env.PORT || '5001', 10);
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "50mb" }));

app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

app.use("/api/auth", authRouter);
app.use("/api/email", emailRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/listings", listingsRouter);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

app.listen(PORT, () => {
  console.log(`[Server] Running on http://localhost:${PORT}`);
});

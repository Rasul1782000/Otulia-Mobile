import "dotenv/config";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
import emailRouter from "./routes/email.js";
import paymentRouter from "./routes/payment.js";
import uploadRouter from "./routes/upload.js";
import "./db.js";

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "50mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

app.get("/api/test", (_req, res) => {
  res.json({ message: "API working fine" });
});

app.use("/api/auth", authRouter);
app.use("/api/email", emailRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/upload", uploadRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`  POST  /api/auth/register   – create account`);
  console.log(`  POST  /api/auth/login      – sign in`);
  console.log(`  POST  /api/auth/google     – google OAuth`);
  console.log(`  GET   /api/auth/users      – list all users`);
  console.log(`  POST  /api/email/send      – send email`);
  console.log(`  POST  /api/payment/create  – create PayPal order`);
  console.log(`  POST  /api/upload/image    – upload image to Cloudinary`);
});

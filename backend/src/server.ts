import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
import "./db.js"; // initialise DB on startup

const app = express();
const PORT = 3000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

app.get("/api/test", (_req, res) => {
  res.json({ message: "API working fine" });
});

// Authentication & user management
app.use("/api/auth", authRouter);

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`  POST  /api/auth/register   – create account`);
  console.log(`  POST  /api/auth/login      – sign in`);
  console.log(`  GET   /api/auth/users      – list all registered users`);
});
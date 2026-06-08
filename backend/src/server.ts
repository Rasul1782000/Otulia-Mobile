import express from "express";

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// ----------------------
// API ROUTES (Backend only)
// ----------------------


//To test this out we use fetch from the backend to see if its working //

app.get("/api/j", (req, res) => {
  res.json({ message: "Backend is running" });
})

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

// Example API route
app.get("/api/test", (req, res) => {
  res.json({ message: "API working fine" });
});

// ----------------------
// Authentication routes
// ----------------------


// ----------------------
// Start server
// ----------------------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
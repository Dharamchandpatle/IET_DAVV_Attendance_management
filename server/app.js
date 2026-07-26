const express = require("express");
const cors = require("cors");
const path = require("path");

const apiRoutes = require("./routes");
const { sendError } = require("./utils/response");
const {
  corsOrigins,
  frontendOrigin,
  nodeEnv,
} = require("./config/env");

const app = express();

// ---------------------------
// Allowed Origins
// ---------------------------
const allowedOrigins = [
  "https://iet-davv-attendance-management.vercel.app",
  "http://localhost:5173",
  frontendOrigin,
  ...corsOrigins,
]
  .filter(Boolean)
  .map((origin) => origin.replace(/\/$/, ""));

console.log("====================================");
console.log("NODE_ENV:", nodeEnv);
console.log("Allowed Origins:", allowedOrigins);
console.log("====================================");

// ---------------------------
// CORS
// ---------------------------
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------------------
// Root
// ---------------------------
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    environment: nodeEnv,
    allowedOrigins,
  });
});

// ---------------------------
// API
// ---------------------------
app.use("/api", apiRoutes);

// ---------------------------
// Static Uploads
// ---------------------------
app.use(
  "/uploads",
  express.static(path.join(__dirname, "public", "uploads"))
);

// ---------------------------
// 404
// ---------------------------
app.use((req, res) => {
  return sendError(res, "Route not found", 404);
});

// ---------------------------
// Error Handler
// ---------------------------
app.use((err, req, res, next) => {
  console.error(err);

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
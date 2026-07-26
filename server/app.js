const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes");
const { sendError } = require("./utils/response");
const path = require('path');
const { corsOrigins, frontendOrigin, nodeEnv } = require('./config/env');

const app = express();
const allowedOrigins = [...new Set([frontendOrigin, ...corsOrigins].filter(Boolean))];

// Global middleware for JSON and form payloads.
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || nodeEnv === 'development') {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check to verify server is up.
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/health", (req, res) => {
  res.json({ status: 'ok', environment: nodeEnv });
});

// API entrypoint: all routes are mounted under /api.
app.use("/api", apiRoutes);

// Serve uploaded files statically from /uploads
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Fallback for unknown routes.
app.use((req, res) => {
  return sendError(res, "Route not found", 404);
});

module.exports = app;

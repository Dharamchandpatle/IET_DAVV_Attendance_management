const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes");

const app = express();

// Global middleware for JSON and form payloads.
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check to verify server is up.
app.get("/", (req, res) => {
  res.send("Server is running");
});

// API entrypoint: all routes are mounted under /api.
app.use("/api", apiRoutes);

// Fallback for unknown routes.
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;

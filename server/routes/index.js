const express = require("express");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const studentRoutes = require("./studentRoutes");
const facultyRoutes = require("./facultyRoutes");

const router = express.Router();

// Auth + user management routes.
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/students", studentRoutes);
router.use("/faculty", facultyRoutes);

module.exports = router;

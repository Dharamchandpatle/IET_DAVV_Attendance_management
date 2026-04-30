const express = require("express");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const studentRoutes = require("./studentRoutes");
const facultyRoutes = require("./facultyRoutes");
const departmentRoutes = require("./departmentRoutes");
const attendanceRoutes = require("./attendanceRoutes");
const leaveRequestRoutes = require("./leaveRequestRoutes");

const router = express.Router();

// Auth + user management routes.
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/students", studentRoutes);
router.use("/faculty", facultyRoutes);
router.use("/departments", departmentRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/leave-requests", leaveRequestRoutes);

module.exports = router;

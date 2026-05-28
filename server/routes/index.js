const express = require("express");
const authRoutes = require("./authRoutes");
const studentRoutes = require("./studentRoutes");
const facultyRoutes = require("./facultyRoutes");
const attendanceRoutes = require("./attendanceRoutes");
const leaveRequestRoutes = require("./leaveRequestRoutes");
const uploadRoutes = require("./uploadRoutes");
const departmentRoutes = require("./departmentRoutes");

const router = express.Router();

// Auth + user management routes.
router.use("/auth", authRoutes);
router.use("/students", studentRoutes);
router.use("/faculty", facultyRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/leave-requests", leaveRequestRoutes);
router.use('/uploads', uploadRoutes);
router.use("/departments", departmentRoutes);

module.exports = router;

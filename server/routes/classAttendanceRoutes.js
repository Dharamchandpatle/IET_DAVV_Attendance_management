const express = require("express");
const classAttendanceController = require("../controllers/classAttendanceController");
// const { protect, adminOnly } = require("../middleware/authMiddleWare");
const router = express.Router();

// Create attendance record -- Admin and faculty
// router.post("/attendance", protect, classAttendanceController.createAttendance);

// Get attendance by user id -- Admin, faculty, or student (own attendance)
// router.get("/attendance/:user_id", protect, classAttendanceController.getAttendanceByUser);

// Get all attendance records -- Admin only
// router.get("/attendance", protect, adminOnly, classAttendanceController.getAllAttendance);

// Update attendance record -- Admin only
// router.put("/attendance/:id", protect, adminOnly, classAttendanceController.updateAttendance);

// Delete attendance record -- Admin only
// router.delete("/attendance/:id", protect, adminOnly, classAttendanceController.deleteAttendance);

module.exports = router;
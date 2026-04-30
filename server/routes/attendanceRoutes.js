const express = require('express');
const AttendanceController = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Faculty/admin mark attendance.
router.post('/class', authMiddleware(['faculty', 'admin']), AttendanceController.markClassAttendance);

// Students view their own attendance.
router.get('/class/me', authMiddleware(['student']), AttendanceController.getMyAttendance);

module.exports = router;

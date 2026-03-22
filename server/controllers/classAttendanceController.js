const ClassAttendance = require("../models/classAttendanceModel");
const User = require("../models/User");

// Create a new attendance record -- Admin and faculty
exports.createAttendance = async (req, res) => {
    const { user_id, class_date, status } = req.body;
    const loggedInUser = req.user;

    // Only admins and faculty can create attendance records
    if (loggedInUser.role !== 'admin' && loggedInUser.role !== 'faculty') {
        return res.status(403).json({ message: "You are not authorized to create attendance records" });
    }

    // Ensure the user_id is a student
    const user = await User.findUserById(user_id);
    if (!user || user.role !== 'student') {
        return res.status(400).json({ message: "Invalid user_id or user is not a student" });
    }

    try {
        const result = await ClassAttendance.createAttendance(user_id, class_date, status);
        res.status(201).json({
            message: "Attendance record created successfully",
            data: result,
        });
    } catch (err) {
        res.status(500).json({ message: "Error recording attendance", error: err });
    }
};

// Get attendance by user id -- Admin, faculty, or student (own attendance)
exports.getAttendanceByUser = async (req, res) => {
    const { user_id } = req.params;
    const loggedInUser = req.user;

    // Check authorization
    if (loggedInUser.role === 'admin') {
        // Admin can see any user's attendance
    } else if (loggedInUser.role === 'faculty') {
        // Faculty can see any student's attendance
        const user = await User.findUserById(user_id);
        if (!user || user.role !== 'student') {
            return res.status(403).json({ message: "You are not authorized to view this user's attendance" });
        }
    } else if (loggedInUser.role === 'student') {
        // Student can only see their own attendance
        if (loggedInUser.id.toString() !== user_id) {
            return res.status(403).json({ message: "You are not authorized to view this user's attendance" });
        }
    } else {
        return res.status(403).json({ message: "You are not authorized to view this user's attendance" });
    }

    try {
        const attendance = await ClassAttendance.getAttendanceByUser(user_id);
        res.status(200).json({
            message: "Attendance record fetched successfully",
            data: attendance,
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching attendance record", error: err });
    }
};

// Get all attendance (Admin only)
exports.getAllAttendance = async (req, res) => {
    try {
        const attendance = await ClassAttendance.getAllAttendance();
        res.status(200).json({
            message: "Attendance records fetched successfully",
            data: attendance,
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching attendance records", error: err });
    }
};

// Update attendance record (Admin only)
exports.updateAttendance = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const result = await ClassAttendance.updateAttendance(id, status);
        res.status(200).json({
            message: "Attendance record updated successfully",
            data: result,
        });
    } catch (err) {
        res.status(500).json({ message: "Error updating attendance record", error: err });
    }
};

// Delete attendance record (Admin only)
exports.deleteAttendance = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await ClassAttendance.deleteAttendance(id);
        res.status(200).json({
            message: "Attendance record deleted successfully",
            data: result,
        });
    } catch (err) {
        res.status(500).json({ message: "Error deleting attendance record", error: err });
    }
};
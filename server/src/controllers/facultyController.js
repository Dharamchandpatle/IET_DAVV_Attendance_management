const FacultyModel = require('../models/facultyModel');
const bcrypt = require('bcrypt');
const { pool } = require('../config/db');

// Get faculty profile
exports.getFacultyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const faculty = await FacultyModel.getFacultyByUserId(userId);
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty profile not found' });
    }
    
    res.status(200).json({
      faculty: {
        id: faculty.id,
        facultyId: faculty.faculty_id,
        department: faculty.department,
        designation: faculty.designation,
        email: faculty.email,
        firstName: faculty.first_name,
        lastName: faculty.last_name,
        createdAt: faculty.created_at
      }
    });
  } catch (error) {
    console.error('Get faculty profile error:', error);
    res.status(500).json({ message: 'Server error while fetching faculty profile' });
  }
};

// Get faculty classes
exports.getFacultyClasses = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get faculty ID from user ID
    const faculty = await FacultyModel.getFacultyByUserId(userId);
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty profile not found' });
    }
    
    const classes = await FacultyModel.getFacultyClasses(faculty.id);
    
    res.status(200).json({ classes });
  } catch (error) {
    console.error('Get faculty classes error:', error);
    res.status(500).json({ message: 'Server error while fetching faculty classes' });
  }
};

// Get class students
exports.getClassStudents = async (req, res) => {
  try {
    const { classId } = req.params;
    const userId = req.user.id;
    
    // Get faculty ID from user ID
    const faculty = await FacultyModel.getFacultyByUserId(userId);
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty profile not found' });
    }
    
    // Check if faculty is assigned to this class
    const [classRows] = await pool.execute(
      'SELECT id FROM classes WHERE id = ? AND faculty_id = ?',
      [classId, faculty.id]
    );
    
    if (!classRows.length) {
      return res.status(403).json({ message: 'You are not authorized to access this class' });
    }
    
    // Get students enrolled in this class
    const [students] = await pool.execute(
      `SELECT s.id, s.student_id, u.first_name, u.last_name, s.department, s.semester, s.section
       FROM class_enrollments ce
       JOIN students s ON ce.student_id = s.id
       JOIN users u ON s.user_id = u.id
       WHERE ce.class_id = ?
       ORDER BY u.first_name, u.last_name`,
      [classId]
    );
    
    res.status(200).json({ students });
  } catch (error) {
    console.error('Get class students error:', error);
    res.status(500).json({ message: 'Server error while fetching class students' });
  }
};

// Get class attendance for a specific date
exports.getClassAttendance = async (req, res) => {
  try {
    const { classId, date } = req.params;
    const userId = req.user.id;
    
    // Get faculty ID from user ID
    const faculty = await FacultyModel.getFacultyByUserId(userId);
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty profile not found' });
    }
    
    // Check if faculty is assigned to this class
    const [classRows] = await pool.execute(
      'SELECT id FROM classes WHERE id = ? AND faculty_id = ?',
      [classId, faculty.id]
    );
    
    if (!classRows.length) {
      return res.status(403).json({ message: 'You are not authorized to access this class' });
    }
    
    // Get attendance records for this class and date
    const [attendanceRecords] = await pool.execute(
      `SELECT ca.id, ca.student_id, ca.status, s.student_id as student_code, u.first_name, u.last_name
       FROM class_attendance ca
       JOIN students s ON ca.student_id = s.id
       JOIN users u ON s.user_id = u.id
       WHERE ca.class_id = ? AND ca.date = ?`,
      [classId, date]
    );
    
    res.status(200).json({ attendanceRecords });
  } catch (error) {
    console.error('Get class attendance error:', error);
    res.status(500).json({ message: 'Server error while fetching class attendance' });
  }
};

// Mark class attendance
exports.markClassAttendance = async (req, res) => {
  try {
    const { classId, date, attendanceRecords } = req.body;
    const userId = req.user.id;
    
    // Get faculty ID from user ID
    const faculty = await FacultyModel.getFacultyByUserId(userId);
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty profile not found' });
    }
    
    // Mark attendance
    await FacultyModel.markClassAttendance(faculty.id, {
      classId,
      date,
      attendanceRecords
    });
    
    res.status(200).json({ message: 'Attendance marked successfully' });
  } catch (error) {
    console.error('Mark class attendance error:', error);
    res.status(500).json({ message: 'Server error while marking attendance' });
  }
};

// Get exams for faculty
exports.getFacultyExams = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get faculty ID from user ID
    const faculty = await FacultyModel.getFacultyByUserId(userId);
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty profile not found' });
    }
    
    // Get exams for courses taught by this faculty
    const [exams] = await pool.execute(
      `SELECT e.*, c.course_code, c.course_name
       FROM exams e
       JOIN courses c ON e.course_id = c.id
       JOIN classes cl ON c.id = cl.course_id
       WHERE cl.faculty_id = ?
       ORDER BY e.exam_date DESC`,
      [faculty.id]
    );
    
    res.status(200).json({ exams });
  } catch (error) {
    console.error('Get faculty exams error:', error);
    res.status(500).json({ message: 'Server error while fetching faculty exams' });
  }
};

// Mark exam attendance
exports.markExamAttendance = async (req, res) => {
  try {
    const { examId, attendanceRecords } = req.body;
    const userId = req.user.id;
    
    // Get faculty ID from user ID
    const faculty = await FacultyModel.getFacultyByUserId(userId);
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty profile not found' });
    }
    
    // Mark attendance
    await FacultyModel.markExamAttendance(faculty.id, {
      examId,
      attendanceRecords
    });
    
    res.status(200).json({ message: 'Exam attendance marked successfully' });
  } catch (error) {
    console.error('Mark exam attendance error:', error);
    res.status(500).json({ message: 'Server error while marking exam attendance' });
  }
};

// Get pending leave requests
exports.getPendingLeaveRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const { departmentOnly } = req.query;
    
    // Get faculty ID from user ID
    const faculty = await FacultyModel.getFacultyByUserId(userId);
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty profile not found' });
    }
    
    const leaveRequests = await FacultyModel.getPendingLeaveRequests(faculty.id, {
      departmentOnly: departmentOnly === 'true'
    });
    
    res.status(200).json({ leaveRequests });
  } catch (error) {
    console.error('Get pending leave requests error:', error);
    res.status(500).json({ message: 'Server error while fetching pending leave requests' });
  }
};

// Review leave request
exports.reviewLeaveRequest = async (req, res) => {
  try {
    const { leaveRequestId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Status must be either "approved" or "rejected"' });
    }
    
    // Get faculty ID from user ID
    const faculty = await FacultyModel.getFacultyByUserId(userId);
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty profile not found' });
    }
    
    await FacultyModel.reviewLeaveRequest(faculty.id, leaveRequestId, status);
    
    res.status(200).json({ message: `Leave request ${status} successfully` });
  } catch (error) {
    console.error('Review leave request error:', error);
    res.status(500).json({ message: 'Server error while reviewing leave request' });
  }
}; 
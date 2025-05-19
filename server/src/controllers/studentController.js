const StudentModel = require('../models/studentModel');
const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');

// Get student profile
exports.getStudentProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get student by user ID
    const student = await StudentModel.getStudentByUserId(userId);
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }
    
    res.status(200).json({
      student: {
        id: student.id,
        studentId: student.student_id,
        department: student.department,
        semester: student.semester,
        section: student.section,
        firstName: student.first_name,
        lastName: student.last_name,
        email: student.email,
        createdAt: student.created_at
      }
    });
  } catch (error) {
    console.error('Get student profile error:', error);
    res.status(500).json({ message: 'Server error while fetching student profile' });
  }
};

// Get student attendance
exports.getStudentAttendance = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    // Get student by user ID
    const student = await StudentModel.getStudentByUserId(userId);
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }
    
    // Extract filters from query params
    const filters = {
      courseId: req.query.courseId,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      status: req.query.status,
      limit,
      offset
    };
    
    const [attendance, total] = await Promise.all([
      StudentModel.getStudentAttendance(student.id, filters),
      StudentModel.getStudentAttendanceCount(student.id, filters)
    ]);
    
    // Calculate attendance statistics
    const totalClasses = attendance.length;
    const presentCount = attendance.filter(a => a.status === 'present').length;
    const absentCount = attendance.filter(a => a.status === 'absent').length;
    const lateCount = attendance.filter(a => a.status === 'late').length;
    
    const attendancePercentage = totalClasses > 0 
      ? Math.round((presentCount / totalClasses) * 100) 
      : 0;

    res.json({
      attendance,
      stats: {
        total: totalClasses,
        present: presentCount,
        absent: absentCount,
        late: lateCount,
        percentage: attendancePercentage
      },
      pagination: {
        page,
        limit,
        total,
        hasMore: offset + attendance.length < total
      }
    });
  } catch (error) {
    console.error('Error fetching student attendance:', error);
    res.status(500).json({ message: 'Error fetching attendance records' });
  }
}

// Get student exam attendance
exports.getStudentExamAttendance = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get student by user ID
    const student = await StudentModel.getStudentByUserId(userId);
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }
    
    // Extract filters from query params
    const filters = {
      courseId: req.query.courseId,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      status: req.query.status
    };
    
    const examAttendance = await StudentModel.getStudentExamAttendance(student.id, filters);
    
    // Calculate exam attendance statistics
    const totalExams = examAttendance.length;
    const presentCount = examAttendance.filter(a => a.status === 'present').length;
    const absentCount = examAttendance.filter(a => a.status === 'absent').length;
    
    const attendancePercentage = totalExams > 0 
      ? Math.round((presentCount / totalExams) * 100) 
      : 0;
    
    res.status(200).json({
      examAttendance,
      statistics: {
        totalExams,
        presentCount,
        absentCount,
        attendancePercentage
      }
    });
  } catch (error) {
    console.error('Get student exam attendance error:', error);
    res.status(500).json({ message: 'Server error while fetching exam attendance' });
  }
};

// Get student leave requests
exports.getStudentLeaveRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get student by user ID
    const student = await StudentModel.getStudentByUserId(userId);
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }
    
    const status = req.query.status; // Optional filter by status
    
    const leaveRequests = await StudentModel.getStudentLeaveRequests(student.id, status);
    
    res.status(200).json({ leaveRequests });
  } catch (error) {
    console.error('Get student leave requests error:', error);
    res.status(500).json({ message: 'Server error while fetching leave requests' });
  }
};

// Create leave request
exports.createLeaveRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, reason } = req.body;
    
    // Validate request data
    if (!startDate || !endDate || !reason) {
      return res.status(400).json({ message: 'Start date, end date, and reason are required' });
    }
    
    // Check if start date is before end date
    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ message: 'Start date must be before end date' });
    }
    
    // Get student by user ID
    const student = await StudentModel.getStudentByUserId(userId);
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }
    
    const leaveRequest = await StudentModel.createLeaveRequest(student.id, {
      startDate,
      endDate,
      reason
    });
    
    res.status(201).json({
      message: 'Leave request created successfully',
      leaveRequest
    });
  } catch (error) {
    console.error('Create leave request error:', error);
    res.status(500).json({ message: 'Server error while creating leave request' });
  }
};

// Admin: Create a new student
exports.createStudent = async (req, res) => {
  try {
    const { email, password, firstName, lastName, studentId, department, semester, section } = req.body;
    
    // Check if user with email already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Check if student ID already exists
    const [existingStudentRows] = await pool.execute(
      'SELECT * FROM students WHERE student_id = ?',
      [studentId]
    );
    
    if (existingStudentRows.length > 0) {
      return res.status(400).json({ message: 'Student with this ID already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create student
    const student = await StudentModel.createStudent(
      { email, password: hashedPassword, firstName, lastName },
      { studentId, department, semester, section }
    );
    
    res.status(201).json({
      message: 'Student created successfully',
      student: {
        id: student.studentId,
        email: student.email,
        firstName: student.firstName,
        lastName: student.lastName,
        studentId: student.studentId,
        department: student.department,
        semester: student.semester,
        section: student.section
      }
    });
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ message: 'Server error while creating student' });
  }
};

// Admin: Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // Extract filters from query params
    const filters = {
      department: req.query.department,
      semester: req.query.semester,
      section: req.query.section,
      search: req.query.search
    };
    
    const result = await StudentModel.getAllStudents(page, limit, filters);
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Get all students error:', error);
    res.status(500).json({ message: 'Server error while fetching students' });
  }
};

// Admin: Get student by ID
exports.getStudentById = async (req, res) => {
  try {
    const studentId = req.params.id;
    
    const student = await StudentModel.getStudentById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.status(200).json({
      student: {
        id: student.id,
        userId: student.user_id,
        studentId: student.student_id,
        department: student.department,
        semester: student.semester,
        section: student.section,
        firstName: student.first_name,
        lastName: student.last_name,
        email: student.email,
        createdAt: student.created_at
      }
    });
  } catch (error) {
    console.error('Get student by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching student' });
  }
};

// Admin: Update student
exports.updateStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const { firstName, lastName, email, department, semester, section } = req.body;
    
    // Check if student exists
    const existingStudent = await StudentModel.getStudentById(studentId);
    if (!existingStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // If email is being updated, check if it's already in use by another user
    if (email && email !== existingStudent.email) {
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser && existingUser.id !== existingStudent.user_id) {
        return res.status(400).json({ message: 'Email is already in use by another user' });
      }
    }
    
    // Update student
    const updatedStudent = await StudentModel.updateStudent(studentId, {
      firstName,
      lastName,
      email,
      department,
      semester,
      section
    });
    
    res.status(200).json({
      message: 'Student updated successfully',
      student: {
        id: updatedStudent.id,
        userId: updatedStudent.user_id,
        studentId: updatedStudent.student_id,
        department: updatedStudent.department,
        semester: updatedStudent.semester,
        section: updatedStudent.section,
        firstName: updatedStudent.first_name,
        lastName: updatedStudent.last_name,
        email: updatedStudent.email,
        createdAt: updatedStudent.created_at
      }
    });
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ message: 'Server error while updating student' });
  }
};

// Admin: Delete student
exports.deleteStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    
    // Check if student exists
    const existingStudent = await StudentModel.getStudentById(studentId);
    if (!existingStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Delete student
    await StudentModel.deleteStudent(studentId);
    
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ message: 'Server error while deleting student' });
  }
};

// Get student attendance with policy status
exports.getAttendanceWithPolicy = async (req, res) => {
  try {
    const userId = req.user.id;
    const student = await StudentModel.getStudentByUserId(userId);
    
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }
    
    // Get attendance data
    const attendance = await StudentModel.getStudentAttendance(student.id, req.query);
    
    // Get current attendance policy
    const policy = await AdminModel.getAttendancePolicy();
    
    if (!policy) {
      return res.status(404).json({ message: 'Attendance policy not found' });
    }
    
    // Calculate attendance statistics with policy status
    const totalClasses = attendance.length;
    const presentCount = attendance.filter(a => a.status === 'present').length;
    const absentCount = attendance.filter(a => a.status === 'absent').length;
    const lateCount = attendance.filter(a => a.status === 'late').length;
    
    const attendancePercentage = totalClasses > 0 
      ? Math.round((presentCount / totalClasses) * 100) 
      : 0;
    
    const policyStatus = {
      currentAttendance: attendancePercentage,
      requiredAttendance: policy.minAttendancePercentage,
      isBelow: attendancePercentage < policy.minAttendancePercentage,
      deficit: Math.max(0, policy.minAttendancePercentage - attendancePercentage)
    };
    
    res.status(200).json({
      attendance,
      statistics: {
        total: totalClasses,
        present: presentCount,
        absent: absentCount,
        late: lateCount,
        percentage: attendancePercentage
      },
      policyStatus
    });
  } catch (error) {
    console.error('Get attendance with policy error:', error);
    res.status(500).json({ message: 'Server error while fetching attendance with policy' });
  }
};

// Request leave
exports.requestLeave = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, reason, type } = req.body;
    
    const student = await StudentModel.getStudentByUserId(userId);
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }
    
    // Check if dates are valid
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }
    
    // Create leave request
    const leaveRequest = await StudentModel.createLeaveRequest({
      studentId: student.id,
      startDate,
      endDate,
      reason,
      type,
      status: 'pending'
    });
    
    res.status(201).json({
      message: 'Leave request submitted successfully',
      leaveRequest
    });
  } catch (error) {
    console.error('Create leave request error:', error);
    res.status(500).json({ message: 'Server error while creating leave request' });
  }
};
const AdminModel = require('../models/adminModel');
const StudentModel = require('../models/studentModel');
const FacultyModel = require('../models/facultyModel');
const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const { pool } = require('../config/db');

// Update the helper function to use environment variable
const isValidInstitutionalEmail = (email) => {
  const allowedDomain = process.env.ALLOWED_EMAIL_DOMAIN || 'ietdavv.edu.in';
  return email.endsWith(`@${allowedDomain}`);
};

// Create a student
exports.createStudent = async (req, res) => {
  try {
    const { email, password, firstName, lastName, studentId, department, semester, section } = req.body;
    
    // Validate email domain
    if (!isValidInstitutionalEmail(email)) {
      return res.status(400).json({ 
        message: 'Registration failed. Only @ietdavv.edu.in email addresses are allowed.' 
      });
    }
    
    // Check if email already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    // Check if student ID already exists
    const [studentRows] = await pool.execute(
      'SELECT id FROM students WHERE student_id = ?',
      [studentId]
    );
    
    if (studentRows.length) {
      return res.status(400).json({ message: 'Student ID already in use' });
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
        email,
        firstName,
        lastName,
        studentId,
        department,
        semester,
        section
      }
    });
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ message: 'Server error while creating student' });
  }
};

// Create a faculty member
exports.createFaculty = async (req, res) => {
  try {
    const { email, password, firstName, lastName, facultyId, department, designation } = req.body;
    
    // Validate email domain
    if (!isValidInstitutionalEmail(email)) {
      return res.status(400).json({ 
        message: 'Registration failed. Only @ietdavv.edu.in email addresses are allowed.' 
      });
    }
    
    // Check if email already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    // Check if faculty ID already exists
    const [facultyRows] = await pool.execute(
      'SELECT id FROM faculty WHERE faculty_id = ?',
      [facultyId]
    );
    
    if (facultyRows.length) {
      return res.status(400).json({ message: 'Faculty ID already in use' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create faculty
    const faculty = await FacultyModel.createFaculty(
      { email, password: hashedPassword, firstName, lastName },
      { facultyId, department, designation }
    );
    
    res.status(201).json({
      message: 'Faculty created successfully',
      faculty: {
        id: faculty.facultyId,
        email,
        firstName,
        lastName,
        facultyId,
        department,
        designation
      }
    });
  } catch (error) {
    console.error('Create faculty error:', error);
    res.status(500).json({ message: 'Server error while creating faculty' });
  }
};

// Create an admin
exports.createAdmin = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    // Validate email domain
    if (!isValidInstitutionalEmail(email)) {
      return res.status(400).json({ 
        message: 'Registration failed. Only @ietdavv.edu.in email addresses are allowed.' 
      });
    }
    
    // Check if email already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    // Create admin
    const admin = await AdminModel.createAdmin({
      email,
      password,
      firstName,
      lastName
    });
    
    res.status(201).json({
      message: 'Admin created successfully',
      admin: {
        id: admin.id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: 'Server error while creating admin' });
  }
};

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10, department, semester, section, search } = req.query;
    
    const result = await StudentModel.getAllStudents(page, limit, {
      department,
      semester,
      section,
      search
    });
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Get all students error:', error);
    res.status(500).json({ message: 'Server error while fetching students' });
  }
};

// Get all faculty
exports.getAllFaculty = async (req, res) => {
  try {
    const { page = 1, limit = 10, department, designation, search } = req.query;
    
    const result = await FacultyModel.getAllFaculty(page, limit, {
      department,
      designation,
      search
    });
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Get all faculty error:', error);
    res.status(500).json({ message: 'Server error while fetching faculty' });
  }
};

// Get attendance policy
exports.getAttendancePolicy = async (req, res) => {
  try {
    const policy = await AdminModel.getAttendancePolicy();
    
    if (!policy) {
      return res.status(404).json({ message: 'No attendance policy found' });
    }
    
    res.status(200).json({ policy });
  } catch (error) {
    console.error('Get attendance policy error:', error);
    res.status(500).json({ message: 'Server error while fetching attendance policy' });
  }
};

// Update attendance policy
exports.updateAttendancePolicy = async (req, res) => {
  try {
    const { minAttendancePercentage, lateCountAsAbsent } = req.body;
    const userId = req.user.id;
    
    const policy = await AdminModel.updateAttendancePolicy({
      minAttendancePercentage,
      lateCountAsAbsent
    }, userId);
    
    res.status(200).json({
      message: 'Attendance policy updated successfully',
      policy
    });
  } catch (error) {
    console.error('Update attendance policy error:', error);
    res.status(500).json({ message: 'Server error while updating attendance policy' });
  }
};

// Create a course
exports.createCourse = async (req, res) => {
  try {
    const { courseCode, courseName, department, semester, credits } = req.body;
    
    // Check if course code already exists
    const [courseRows] = await pool.execute(
      'SELECT id FROM courses WHERE course_code = ?',
      [courseCode]
    );
    
    if (courseRows.length) {
      return res.status(400).json({ message: 'Course code already in use' });
    }
    
    const course = await AdminModel.createCourse({
      courseCode,
      courseName,
      department,
      semester,
      credits
    });
    
    res.status(201).json({
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Server error while creating course' });
  }
};

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const { department, semester } = req.query;
    
    let query = 'SELECT * FROM courses WHERE 1=1';
    const params = [];
    
    if (department) {
      query += ' AND department = ?';
      params.push(department);
    }
    
    if (semester) {
      query += ' AND semester = ?';
      params.push(semester);
    }
    
    query += ' ORDER BY course_code';
    
    const [courses] = await pool.execute(query, params);
    
    res.status(200).json({ courses });
  } catch (error) {
    console.error('Get all courses error:', error);
    res.status(500).json({ message: 'Server error while fetching courses' });
  }
};

// Create a class
exports.createClass = async (req, res) => {
  try {
    const { courseId, facultyId, semester, section, academicYear } = req.body;
    
    const classObj = await AdminModel.createClass({
      courseId,
      facultyId,
      semester,
      section,
      academicYear
    });
    
    res.status(201).json({
      message: 'Class created successfully',
      class: classObj
    });
  } catch (error) {
    console.error('Create class error:', error);
    res.status(500).json({ message: 'Server error while creating class' });
  }
};

// Enroll students in a class
exports.enrollStudents = async (req, res) => {
  try {
    const { classId, studentIds } = req.body;
    
    await AdminModel.enrollStudents(classId, studentIds);
    
    res.status(200).json({
      message: 'Students enrolled successfully'
    });
  } catch (error) {
    console.error('Enroll students error:', error);
    res.status(500).json({ message: 'Server error while enrolling students' });
  }
};

// Create an exam
exports.createExam = async (req, res) => {
  try {
    const { courseId, examName, examDate, startTime, endTime } = req.body;
    
    const exam = await AdminModel.createExam({
      courseId,
      examName,
      examDate,
      startTime,
      endTime
    });
    
    res.status(201).json({
      message: 'Exam created successfully',
      exam
    });
  } catch (error) {
    console.error('Create exam error:', error);
    res.status(500).json({ message: 'Server error while creating exam' });
  }
};

// Create a holiday
exports.createHoliday = async (req, res) => {
  try {
    const { holidayName, holidayDate, description } = req.body;
    const userId = req.user.id;
    
    const holiday = await AdminModel.createHoliday({
      holidayName,
      holidayDate,
      description
    }, userId);
    
    res.status(201).json({
      message: 'Holiday created successfully',
      holiday
    });
  } catch (error) {
    console.error('Create holiday error:', error);
    res.status(500).json({ message: 'Server error while creating holiday' });
  }
};

// Get all holidays
exports.getAllHolidays = async (req, res) => {
  try {
    const holidays = await AdminModel.getAllHolidays();
    
    res.status(200).json({ holidays });
  } catch (error) {
    console.error('Get all holidays error:', error);
    res.status(500).json({ message: 'Server error while fetching holidays' });
  }
};

// Generate attendance report
exports.generateAttendanceReport = async (req, res) => {
  try {
    const { department, semester, courseId, startDate, endDate, belowThreshold } = req.query;
    
    const report = await AdminModel.generateAttendanceReport({
      department,
      semester,
      courseId,
      startDate,
      endDate,
      belowThreshold: belowThreshold === 'true'
    });
    
    res.status(200).json({ report });
  } catch (error) {
    console.error('Generate attendance report error:', error);
    res.status(500).json({ message: 'Server error while generating attendance report' });
  }
};

// Batch import students from Excel
exports.batchImportStudents = async (req, res) => {
  try {
    const { students } = req.body;
    const results = {
      successful: [],
      failed: []
    };

    for (const student of students) {
      try {
        const hashedPassword = await bcrypt.hash(student.password, 10);
        await StudentModel.createStudent(
          { 
            email: student.email, 
            password: hashedPassword, 
            firstName: student.firstName, 
            lastName: student.lastName 
          },
          { 
            studentId: student.studentId, 
            department: student.department, 
            semester: student.semester, 
            section: student.section 
          }
        );
        results.successful.push(student.studentId);
      } catch (error) {
        results.failed.push({
          studentId: student.studentId,
          reason: error.message
        });
      }
    }

    res.status(200).json({
      message: 'Batch import completed',
      results
    });
  } catch (error) {
    console.error('Batch import students error:', error);
    res.status(500).json({ message: 'Server error during batch import' });
  }
};

// Batch import faculty from Excel
exports.batchImportFaculty = async (req, res) => {
  try {
    const { faculty } = req.body;
    const results = {
      successful: [],
      failed: []
    };

    for (const member of faculty) {
      try {
        const hashedPassword = await bcrypt.hash(member.password, 10);
        await FacultyModel.createFaculty(
          { 
            email: member.email, 
            password: hashedPassword, 
            firstName: member.firstName, 
            lastName: member.lastName 
          },
          { 
            facultyId: member.facultyId, 
            department: member.department, 
            designation: member.designation 
          }
        );
        results.successful.push(member.facultyId);
      } catch (error) {
        results.failed.push({
          facultyId: member.facultyId,
          reason: error.message
        });
      }
    }

    res.status(200).json({
      message: 'Batch import completed',
      results
    });
  } catch (error) {
    console.error('Batch import faculty error:', error);
    res.status(500).json({ message: 'Server error during batch import' });
  }
};

// Export students data to Excel
exports.exportStudentsData = async (req, res) => {
  try {
    const { department, semester, section } = req.query;
    const students = await StudentModel.getAllStudents(1, 1000, {
      department,
      semester,
      section
    });

    res.status(200).json({
      students: students.data.map(s => ({
        studentId: s.studentId,
        email: s.email,
        firstName: s.firstName,
        lastName: s.lastName,
        department: s.department,
        semester: s.semester,
        section: s.section
      }))
    });
  } catch (error) {
    console.error('Export students data error:', error);
    res.status(500).json({ message: 'Server error while exporting student data' });
  }
};

// Export faculty data to Excel
exports.exportFacultyData = async (req, res) => {
  try {
    const { department, designation } = req.query;
    const faculty = await FacultyModel.getAllFaculty(1, 1000, {
      department,
      designation
    });

    res.status(200).json({
      faculty: faculty.data.map(f => ({
        facultyId: f.facultyId,
        email: f.email,
        firstName: f.firstName,
        lastName: f.lastName,
        department: f.department,
        designation: f.designation
      }))
    });
  } catch (error) {
    console.error('Export faculty data error:', error);
    res.status(500).json({ message: 'Server error while exporting faculty data' });
  }
};

// Get attendance policy
exports.getAttendancePolicy = async (req, res) => {
  try {
    const policy = await AdminModel.getAttendancePolicy();
    
    if (!policy) {
      return res.status(404).json({ message: 'Attendance policy not found' });
    }
    
    res.status(200).json({ policy });
  } catch (error) {
    console.error('Get attendance policy error:', error);
    res.status(500).json({ message: 'Server error while fetching attendance policy' });
  }
};

// Update attendance policy
exports.updateAttendancePolicy = async (req, res) => {
  try {
    const { minAttendancePercentage, maxLeaveRequests, graceMinutes, lateMarkAfterMinutes } = req.body;
    
    // Validate policy settings
    if (minAttendancePercentage < 0 || minAttendancePercentage > 100) {
      return res.status(400).json({ message: 'Minimum attendance percentage must be between 0 and 100' });
    }
    
    if (maxLeaveRequests < 0) {
      return res.status(400).json({ message: 'Maximum leave requests must be non-negative' });
    }
    
    if (graceMinutes < 0) {
      return res.status(400).json({ message: 'Grace period minutes must be non-negative' });
    }
    
    if (lateMarkAfterMinutes < 0) {
      return res.status(400).json({ message: 'Late mark minutes must be non-negative' });
    }
    
    const updatedPolicy = await AdminModel.updateAttendancePolicy({
      minAttendancePercentage,
      maxLeaveRequests,
      graceMinutes,
      lateMarkAfterMinutes
    });
    
    res.status(200).json({
      message: 'Attendance policy updated successfully',
      policy: updatedPolicy
    });
  } catch (error) {
    console.error('Update attendance policy error:', error);
    res.status(500).json({ message: 'Server error while updating attendance policy' });
  }
};

// Get leave policy
exports.getLeavePolicy = async (req, res) => {
  try {
    const policy = await AdminModel.getLeavePolicy();
    
    if (!policy) {
      return res.status(404).json({ message: 'Leave policy not found' });
    }
    
    res.status(200).json({ policy });
  } catch (error) {
    console.error('Get leave policy error:', error);
    res.status(500).json({ message: 'Server error while fetching leave policy' });
  }
};

// Update leave policy
exports.updateLeavePolicy = async (req, res) => {
  try {
    const { 
      maxMedicalLeaves,
      maxCasualLeaves,
      maxEmergencyLeaves,
      requiresDocumentation,
      minAdvanceNotice
    } = req.body;
    
    // Validate policy settings
    if (maxMedicalLeaves < 0 || maxCasualLeaves < 0 || maxEmergencyLeaves < 0) {
      return res.status(400).json({ message: 'Leave limits must be non-negative' });
    }
    
    if (minAdvanceNotice < 0) {
      return res.status(400).json({ message: 'Minimum advance notice must be non-negative' });
    }
    
    const updatedPolicy = await AdminModel.updateLeavePolicy({
      maxMedicalLeaves,
      maxCasualLeaves,
      maxEmergencyLeaves,
      requiresDocumentation,
      minAdvanceNotice
    });
    
    res.status(200).json({
      message: 'Leave policy updated successfully',
      policy: updatedPolicy
    });
  } catch (error) {
    console.error('Update leave policy error:', error);
    res.status(500).json({ message: 'Server error while updating leave policy' });
  }
};
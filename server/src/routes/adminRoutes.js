const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Course = require('../models/Course');
const Class = require('../models/Class');
const Holiday = require('../models/Holiday');
const adminController = require('../controllers/adminController');
const { authenticate, authorizeAdmin, authorize } = require('../middleware/auth');

// Middleware to check if user is an admin
router.use(authenticate);
router.use(authorizeAdmin);

// Get dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    // In a real app, fetch data from database
    // For now, return mock data
    res.json({
      stats: {
        students: 450,
        faculty: 35,
        courses: 25,
        classes: 40
      },
      attendanceOverview: {
        present: 85,
        absent: 10,
        leave: 5
      },
      recentActivities: [
        { id: 1, type: 'student', action: 'added', name: 'John Doe', time: '2 hours ago' },
        { id: 2, type: 'faculty', action: 'updated', name: 'Prof. Smith', time: '1 day ago' },
        { id: 3, type: 'course', action: 'added', name: 'Advanced Database', time: '2 days ago' },
        { id: 4, type: 'holiday', action: 'added', name: 'Mid-semester Break', time: '3 days ago' }
      ],
      departmentAttendance: [
        { name: 'Computer Science', present: 88, absent: 12 },
        { name: 'Information Technology', present: 85, absent: 15 },
        { name: 'Electronics', present: 82, absent: 18 },
        { name: 'Mechanical', present: 80, absent: 20 },
        { name: 'Civil', present: 78, absent: 22 }
      ]
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get students
router.get('/students', async (req, res) => {
  try {
    // In a real app, fetch from database
    // For now, return mock data
    res.json([
      { 
        id: 1, 
        name: 'John Doe', 
        email: 'john@ietdavv.edu.in',
        rollNo: 'CSE001',
        class: 'CSE-A',
        semester: 3,
        phone: '9876543210',
        address: '123 Main St, City',
        joinedOn: '2021-07-15'
      },
      { 
        id: 2, 
        name: 'Jane Smith', 
        email: 'jane@ietdavv.edu.in',
        rollNo: 'CSE002',
        class: 'CSE-A',
        semester: 3,
        phone: '9876543211',
        address: '456 Park Ave, City',
        joinedOn: '2021-07-15'
      },
      { 
        id: 3, 
        name: 'Alice Johnson', 
        email: 'alice@ietdavv.edu.in',
        rollNo: 'CSE003',
        class: 'CSE-A',
        semester: 3,
        phone: '9876543212',
        address: '789 Oak St, City',
        joinedOn: '2021-07-16'
      }
    ]);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create student
router.post('/students', async (req, res) => {
  try {
    const { name, email, password, rollNo, class: className, semester, phone, address } = req.body;
    
    // Validate input
    if (!name || !email || !password || !rollNo || !className || !semester) {
      return res.status(400).json({ message: 'Required fields missing' });
    }
    
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'student'
    });
    
    // Save user
    await newUser.save();
    
    // In a real app, create student profile with additional details
    
    res.status(201).json({
      message: 'Student created successfully',
      student: {
        id: newUser._id,
        name,
        email,
        rollNo,
        class: className,
        semester,
        phone,
        address,
        joinedOn: new Date().toISOString().split('T')[0]
      }
    });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update student
router.put('/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, rollNo, class: className, semester, phone, address } = req.body;
    
    // In a real app, update in database
    
    res.json({
      message: 'Student updated successfully',
      student: {
        id,
        name,
        email,
        rollNo,
        class: className,
        semester,
        phone,
        address
      }
    });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete student
router.delete('/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // In a real app, delete from database
    
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Similar CRUD operations for faculty, courses, classes, holidays, etc.
// ...

// Get attendance report
router.get('/reports/attendance', async (req, res) => {
  try {
    const { class: className, course, from, to } = req.query;
    
    // In a real app, fetch from database with filters
    // For now, return mock data
    res.json({
      class: className || 'All',
      course: course || 'All',
      period: {
        from: from || '2023-06-01',
        to: to || '2023-06-30'
      },
      summary: {
        total: 100,
        present: 85,
        absent: 10,
        leave: 5
      },
      students: [
        {
          id: 1,
          name: 'John Doe',
          rollNo: 'CSE001',
          present: 90,
          absent: 8,
          leave: 2
        },
        {
          id: 2,
          name: 'Jane Smith',
          rollNo: 'CSE002',
          present: 85,
          absent: 10,
          leave: 5
        },
        {
          id: 3,
          name: 'Alice Johnson',
          rollNo: 'CSE003',
          present: 80,
          absent: 15,
          leave: 5
        }
      ]
    });
  } catch (error) {
    console.error('Error fetching attendance report:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Policy management routes
router.get('/policy/attendance', authenticate, adminController.getAttendancePolicy);
router.put('/policy/attendance', authenticate, adminController.updateAttendancePolicy);
router.get('/policy/leave', authenticate, adminController.getLeavePolicy);
router.put('/policy/leave', authenticate, adminController.updateLeavePolicy);

// Batch import/export routes
router.post('/batch-import/students', authenticate, authorize(['admin']), adminController.batchImportStudents);
router.post('/batch-import/faculty', authenticate, authorize(['admin']), adminController.batchImportFaculty);
router.get('/export/students', authenticate, authorize(['admin']), adminController.exportStudentsData);
router.get('/export/faculty', authenticate, authorize(['admin']), adminController.exportFacultyData);

module.exports = router;
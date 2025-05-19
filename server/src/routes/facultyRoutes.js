const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Class = require('../models/Class');
const Attendance = require('../models/Attendance');
const LeaveRequest = require('../models/LeaveRequest');
const { authenticate, authorizeFaculty } = require('../middleware/auth');

// Middleware to check if user is a faculty
router.use(authenticate);
router.use(authorizeFaculty);

// Get dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    // In a real app, fetch data from database
    // For now, return mock data
    res.json({
      todayClasses: [
        { id: 1, course: 'Mathematics', class: 'CSE-A', time: '09:00 AM', room: 'A101', students: 45 },
        { id: 2, course: 'Mathematics', class: 'CSE-B', time: '11:00 AM', room: 'B202', students: 40 },
        { id: 3, course: 'Advanced Calculus', class: 'IT-A', time: '02:00 PM', room: 'C303', students: 35 }
      ],
      attendanceStats: {
        total: 120,
        present: 95,
        absent: 15,
        leave: 10
      },
      classAttendance: [
        { name: 'CSE-A', present: 90, absent: 10 },
        { name: 'CSE-B', present: 85, absent: 15 },
        { name: 'IT-A', present: 75, absent: 25 }
      ],
      pendingLeaveRequests: [
        { id: 1, student: 'John Doe', from: '2023-06-15', to: '2023-06-16', reason: 'Medical appointment' },
        { id: 2, student: 'Jane Smith', from: '2023-06-20', to: '2023-06-20', reason: 'Family function' }
      ],
      recentActivities: [
        { id: 1, type: 'attendance', class: 'CSE-A', course: 'Mathematics', time: '2 hours ago' },
        { id: 2, type: 'leave', student: 'Alice Johnson', status: 'approved', time: '1 day ago' },
        { id: 3, type: 'attendance', class: 'IT-A', course: 'Advanced Calculus', time: '2 days ago' }
      ]
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get classes
router.get('/classes', async (req, res) => {
  try {
    // In a real app, fetch from database
    // For now, return mock data
    res.json([
      { 
        id: 1, 
        course: 'Mathematics', 
        code: 'MATH101',
        class: 'CSE-A', 
        semester: 3,
        schedule: [
          { day: 'Monday', time: '09:00 AM', room: 'A101' },
          { day: 'Wednesday', time: '10:00 AM', room: 'A101' },
          { day: 'Friday', time: '09:00 AM', room: 'A101' }
        ],
        students: 45
      },
      { 
        id: 2, 
        course: 'Mathematics', 
        code: 'MATH101',
        class: 'CSE-B', 
        semester: 3,
        schedule: [
          { day: 'Monday', time: '11:00 AM', room: 'B202' },
          { day: 'Wednesday', time: '01:00 PM', room: 'B202' },
          { day: 'Friday', time: '11:00 AM', room: 'B202' }
        ],
        students: 40
      },
      { 
        id: 3, 
        course: 'Advanced Calculus', 
        code: 'MATH201',
        class: 'IT-A', 
        semester: 5,
        schedule: [
          { day: 'Tuesday', time: '02:00 PM', room: 'C303' },
          { day: 'Thursday', time: '02:00 PM', room: 'C303' }
        ],
        students: 35
      }
    ]);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get class students
router.get('/classes/:id/students', async (req, res) => {
  try {
    const { id } = req.params;
    
    // In a real app, fetch from database
    // For now, return mock data
    res.json([
      { id: 1, name: 'John Doe', rollNo: 'CSE001', email: 'john@ietdavv.edu.in' },
      { id: 2, name: 'Jane Smith', rollNo: 'CSE002', email: 'jane@ietdavv.edu.in' },
      { id: 3, name: 'Alice Johnson', rollNo: 'CSE003', email: 'alice@ietdavv.edu.in' },
      { id: 4, name: 'Bob Brown', rollNo: 'CSE004', email: 'bob@ietdavv.edu.in' },
      { id: 5, name: 'Charlie Davis', rollNo: 'CSE005', email: 'charlie@ietdavv.edu.in' }
    ]);
  } catch (error) {
    console.error('Error fetching class students:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark attendance
router.post('/classes/:id/attendance', async (req, res) => {
  try {
    const { id } = req.params;
    const { date, attendance } = req.body;
    
    // Validate input
    if (!date || !attendance || !Array.isArray(attendance)) {
      return res.status(400).json({ message: 'Invalid attendance data' });
    }
    
    // In a real app, save to database
    // For now, return success
    res.json({
      message: 'Attendance marked successfully',
      classId: id,
      date,
      markedCount: attendance.length
    });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get exams
router.get('/exams', async (req, res) => {
  try {
    // In a real app, fetch from database
    // For now, return mock data
    res.json([
      { 
        id: 1, 
        course: 'Mathematics', 
        class: 'CSE-A',
        type: 'Mid-term',
        date: '2023-06-15', 
        time: '09:00 AM', 
        duration: '2 hours',
        venue: 'Hall A',
        totalMarks: 50
      },
      { 
        id: 2, 
        course: 'Mathematics', 
        class: 'CSE-B',
        type: 'Mid-term',
        date: '2023-06-15', 
        time: '11:30 AM', 
        duration: '2 hours',
        venue: 'Hall B',
        totalMarks: 50
      },
      { 
        id: 3, 
        course: 'Advanced Calculus', 
        class: 'IT-A',
        type: 'Quiz',
        date: '2023-06-20', 
        time: '02:00 PM', 
        duration: '1 hour',
        venue: 'Lab 101',
        totalMarks: 20
      }
    ]);
  } catch (error) {
    console.error('Error fetching exams:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get leave requests
router.get('/leave-requests', async (req, res) => {
  try {
    // In a real app, fetch from database
    // For now, return mock data
    res.json([
      { 
        id: 1, 
        student: 'John Doe',
        rollNo: 'CSE001',
        class: 'CSE-A',
        from: '2023-06-15', 
        to: '2023-06-16', 
        reason: 'Medical appointment',
        status: 'pending',
        appliedOn: '2023-06-10'
      },
      { 
        id: 2, 
        student: 'Jane Smith',
        rollNo: 'CSE002',
        class: 'CSE-A',
        from: '2023-06-20', 
        to: '2023-06-20', 
        reason: 'Family function',
        status: 'pending',
        appliedOn: '2023-06-12'
      },
      { 
        id: 3, 
        student: 'Alice Johnson',
        rollNo: 'CSE003',
        class: 'CSE-A',
        from: '2023-06-05', 
        to: '2023-06-07', 
        reason: 'Fever',
        status: 'approved',
        appliedOn: '2023-06-03',
        reviewedOn: '2023-06-04'
      },
      { 
        id: 4, 
        student: 'Bob Brown',
        rollNo: 'CSE004',
        class: 'CSE-A',
        from: '2023-06-01', 
        to: '2023-06-02', 
        reason: 'Personal',
        status: 'rejected',
        appliedOn: '2023-05-30',
        reviewedOn: '2023-05-31',
        comments: 'Insufficient reason provided'
      }
    ]);
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Review leave request
router.put('/leave-requests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, comments } = req.body;
    
    // Validate input
    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    // In a real app, update in database
    // For now, return success
    res.json({
      message: `Leave request ${status}`,
      requestId: id,
      status,
      reviewedOn: new Date().toISOString().split('T')[0],
      reviewedBy: req.user.name,
      comments
    });
  } catch (error) {
    console.error('Error reviewing leave request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile
router.put('/profile', async (req, res) => {
  try {
    const { name, email, phone, department, qualification } = req.body;
    
    // In a real app, update in database
    // For now, return success
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: req.user.id,
        name: name || req.user.name,
        email: email || req.user.email,
        phone,
        department,
        qualification
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 
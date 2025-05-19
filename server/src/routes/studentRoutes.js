const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
// const LeaveRequest = require('../models/LeaveRequest');
// const Course = require('../models/Course');
const { authenticate, authorizeStudent } = require('../middleware/auth');

// Middleware to check if user is a student
router.use(authenticate);
router.use(authorizeStudent);

// Get dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    // In a real app, fetch data from database
    // For now, return mock data
    res.json({
      attendanceSummary: {
        present: 85,
        absent: 10,
        leave: 5,
        total: 100
      },
      courseAttendance: [
        { name: 'Mathematics', present: 90, absent: 10 },
        { name: 'Physics', present: 85, absent: 15 },
        { name: 'Computer Science', present: 80, absent: 20 },
        { name: 'English', present: 95, absent: 5 }
      ],
      upcomingExams: [
        { id: 1, course: 'Mathematics', date: '2023-06-15', time: '09:00 AM', venue: 'Hall A' },
        { id: 2, course: 'Physics', date: '2023-06-18', time: '10:30 AM', venue: 'Hall B' },
        { id: 3, course: 'Computer Science', date: '2023-06-20', time: '02:00 PM', venue: 'Lab 101' }
      ],
      recentAttendance: [
        { id: 1, course: 'Mathematics', date: '2023-06-01', status: 'present' },
        { id: 2, course: 'Physics', date: '2023-06-01', status: 'present' },
        { id: 3, course: 'Computer Science', date: '2023-06-02', status: 'absent' },
        { id: 4, course: 'English', date: '2023-06-02', status: 'present' },
        { id: 5, course: 'Mathematics', date: '2023-06-03', status: 'present' }
      ]
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get attendance records
router.get('/attendance', async (req, res) => {
  try {
    // In a real app, fetch data from database with filters
    // For now, return mock data
    res.json({
      attendance: [
        { id: 1, date: '2023-06-01', course: 'Mathematics', status: 'present' },
        { id: 2, date: '2023-06-01', course: 'Physics', status: 'present' },
        { id: 3, date: '2023-06-02', course: 'Computer Science', status: 'absent' },
        { id: 4, date: '2023-06-02', course: 'English', status: 'present' },
        { id: 5, date: '2023-06-03', course: 'Mathematics', status: 'present' },
        { id: 6, date: '2023-06-03', course: 'Physics', status: 'present' },
        { id: 7, date: '2023-06-04', course: 'Computer Science', status: 'present' },
        { id: 8, date: '2023-06-04', course: 'English', status: 'leave' },
        { id: 9, date: '2023-06-05', course: 'Mathematics', status: 'present' },
        { id: 10, date: '2023-06-05', course: 'Physics', status: 'absent' }
      ],
      summary: {
        total: 100,
        present: 85,
        absent: 10,
        leave: 5
      }
    });
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get leave requests
router.get('/leave-requests', async (req, res) => {
  try {
    // In a real app, fetch data from database
    // For now, return mock data
    res.json([
      { 
        id: 1, 
        from: '2023-06-10', 
        to: '2023-06-12', 
        reason: 'Medical appointment', 
        status: 'approved',
        appliedOn: '2023-06-05',
        reviewedBy: 'Prof. Johnson',
        reviewedOn: '2023-06-06'
      },
      { 
        id: 2, 
        from: '2023-06-15', 
        to: '2023-06-15', 
        reason: 'Family function', 
        status: 'pending',
        appliedOn: '2023-06-08'
      },
      { 
        id: 3, 
        from: '2023-05-20', 
        to: '2023-05-22', 
        reason: 'Fever', 
        status: 'rejected',
        appliedOn: '2023-05-18',
        reviewedBy: 'Prof. Smith',
        reviewedOn: '2023-05-19',
        comments: 'Insufficient documentation provided'
      }
    ]);
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit leave request
router.post('/leave-requests', async (req, res) => {
  try {
    const { from, to, reason } = req.body;
    
    // Validate input
    if (!from || !to || !reason) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // In a real app, save to database
    // For now, return mock response
    res.status(201).json({
      id: Math.floor(Math.random() * 1000),
      from,
      to,
      reason,
      status: 'pending',
      appliedOn: new Date().toISOString().split('T')[0]
    });
  } catch (error) {
    console.error('Error submitting leave request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel leave request
router.delete('/leave-requests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // In a real app, delete from database
    // For now, return success
    res.json({ message: 'Leave request cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling leave request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get holidays
router.get('/holidays', async (req, res) => {
  try {
    // In a real app, fetch from database
    // For now, return mock data
    res.json([
      { id: 1, name: 'Independence Day', date: '2023-08-15', type: 'national' },
      { id: 2, name: 'Diwali', date: '2023-11-12', type: 'festival' },
      { id: 3, name: 'Christmas', date: '2023-12-25', type: 'festival' },
      { id: 4, name: 'New Year', date: '2024-01-01', type: 'holiday' },
      { id: 5, name: 'Republic Day', date: '2024-01-26', type: 'national' },
      { id: 6, name: 'Holi', date: '2024-03-25', type: 'festival' }
    ]);
  } catch (error) {
    console.error('Error fetching holidays:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile
router.put('/profile', async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    
    // In a real app, update in database
    // For now, return success
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: req.user.id,
        name: name || req.user.name,
        email: email || req.user.email,
        phone,
        address
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 
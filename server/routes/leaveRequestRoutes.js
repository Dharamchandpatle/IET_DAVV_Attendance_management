const express = require('express');
const LeaveRequestController = require('../controllers/leaveRequestController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Students create leave requests.
router.post('/', authMiddleware(['student']), LeaveRequestController.create);

// Students view their own requests; faculty/admin can view all.
router.get('/', authMiddleware(['student', 'faculty', 'admin']), LeaveRequestController.list);

// Faculty/admin review leave requests.
router.patch('/:id/status', authMiddleware(['faculty', 'admin']), LeaveRequestController.updateStatus);

module.exports = router;

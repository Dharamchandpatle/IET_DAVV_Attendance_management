const express = require('express');
const LeaveRequestController = require('../controllers/leaveRequestController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Students create leave requests.
router.post('/', authMiddleware(['student']), LeaveRequestController.create);

// Students view their own requests; faculty/admin can view all.
router.get('/', authMiddleware(['student', 'faculty', 'admin']), LeaveRequestController.list);

// Faculty/admin review leave requests.
// Allow students to cancel their own requests and faculty/admin to update status.
router.patch('/:id/status', authMiddleware(['student', 'faculty', 'admin']), LeaveRequestController.updateStatus);

// Allow deletion of leave requests (student can delete their own request).
router.delete('/:id', authMiddleware(['student', 'faculty', 'admin']), LeaveRequestController.delete);

module.exports = router;

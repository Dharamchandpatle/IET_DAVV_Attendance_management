const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');

// Student routes (mounted at /api/students).
// Student CRUD (auth handled by /api/auth/register, /api/auth/login)
// Returns the current student's profile when authenticated
router.get('/me', authMiddleware(['student', 'faculty', 'admin']), StudentController.getMyProfile);
router.get('/', authMiddleware(['admin', 'faculty']), StudentController.getAll);
// Admin can create students
router.post('/', authMiddleware(['admin']), StudentController.create);
router.get('/:id', authMiddleware(['admin', 'faculty', 'student']), StudentController.getById);
router.put('/:id', authMiddleware(['admin', 'faculty', 'student']), StudentController.update);
router.delete('/:id', authMiddleware(['admin']), StudentController.remove);

module.exports = router;

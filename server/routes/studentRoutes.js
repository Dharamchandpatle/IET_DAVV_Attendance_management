const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');

// Student routes (mounted at /api/students).
// Student CRUD (auth handled by /api/auth/register, /api/auth/login)
router.get('/', authMiddleware(['admin', 'faculty']), StudentController.getAll);
router.get('/:id', authMiddleware(['admin', 'faculty', 'student']), StudentController.getById);
router.put('/:id', authMiddleware(['admin', 'faculty', 'student']), StudentController.update);
router.delete('/:id', authMiddleware(['admin']), StudentController.remove);

module.exports = router;

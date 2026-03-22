const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');

// Student auth
router.post('/register', StudentController.register);
router.post('/login', StudentController.login);

// Student CRUD
router.get('/', authMiddleware(['admin', 'faculty']), StudentController.getAll);
router.get('/:id', authMiddleware(['admin', 'faculty', 'student']), StudentController.getById);
router.put('/:id', authMiddleware(['admin', 'faculty', 'student']), StudentController.update);
router.delete('/:id', authMiddleware(['admin']), StudentController.remove);

module.exports = router;

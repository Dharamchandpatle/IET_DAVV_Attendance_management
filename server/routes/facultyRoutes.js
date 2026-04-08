const express = require('express');
const router = express.Router();
const FacultyController = require('../controllers/facultyController');
const authMiddleware = require('../middleware/authMiddleware');

// Faculty routes (mounted at /api/faculty).
// Faculty auth
router.post('/register', FacultyController.register);
router.post('/login', FacultyController.login);

// Faculty CRUD
router.get('/', authMiddleware(['admin']), FacultyController.getAll);
router.get('/:id', authMiddleware(['admin', 'faculty']), FacultyController.getById);
router.put('/:id', authMiddleware(['admin', 'faculty']), FacultyController.update);
router.delete('/:id', authMiddleware(['admin']), FacultyController.remove);

module.exports = router;

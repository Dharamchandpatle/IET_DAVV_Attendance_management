const express = require('express');
const router = express.Router();
const FacultyController = require('../controllers/facultyController');
const authMiddleware = require('../middleware/authMiddleware');

// Faculty routes (mounted at /api/faculty).
// Faculty CRUD (auth handled by /api/auth/register, /api/auth/login)
router.get('/', authMiddleware(['admin']), FacultyController.getAll);
// Get faculty record for the currently logged-in user
router.get('/me', authMiddleware(['admin','faculty']), FacultyController.getMe);
// Admin can create faculty
router.post('/', authMiddleware(['admin']), FacultyController.create);
router.get('/:id', authMiddleware(['admin', 'faculty']), FacultyController.getById);
router.put('/:id', authMiddleware(['admin', 'faculty']), FacultyController.update);
router.delete('/:id', authMiddleware(['admin']), FacultyController.remove);

module.exports = router;

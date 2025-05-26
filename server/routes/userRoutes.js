const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');


router.get('/email/:email', authMiddleware(['student', 'faculty', 'admin']), UserController.getUserByEmail);
router.get('/:id', authMiddleware(['student', 'faculty', 'admin']), UserController.getUserById);
router.get('/', authMiddleware(['admin']), UserController.getAllUsers);
router.put('/:id', authMiddleware(['student', 'faculty', 'admin']), UserController.updateUser);
router.patch('/:id/role', authMiddleware(['admin']), UserController.updateUserRole);
router.patch('/:id/last-login', authMiddleware(['student', 'faculty', 'admin']), UserController.updateLastLogin);
router.delete('/:id', authMiddleware(['admin']), UserController.deleteUser);

module.exports = router;
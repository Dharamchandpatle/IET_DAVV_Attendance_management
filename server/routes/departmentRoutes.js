const express = require('express');
const DepartmentController = require('../controllers/departmentController');

const router = express.Router();

// Public department list (used for registration forms).
router.get('/', DepartmentController.list);

module.exports = router;

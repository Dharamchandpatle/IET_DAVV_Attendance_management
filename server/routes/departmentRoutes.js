const express = require('express');
const DepartmentController = require('../controllers/departmentController');

const router = express.Router();

// Public departments list for selectors
router.get('/', DepartmentController.getAll);

module.exports = router;

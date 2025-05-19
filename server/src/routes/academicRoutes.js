const express = require('express');
const router = express.Router();
const academicController = require('../controllers/academicController');
const auth = require('../middleware/auth');

// Academic Session Routes
router.post('/sessions', auth(['admin']), academicController.createAcademicSession);
router.get('/sessions/current', auth(), academicController.getCurrentSession);
router.put('/sessions/:sessionId/set-current', auth(['admin']), academicController.setCurrentSession);

// Department Routes
router.post('/departments', auth(['admin']), academicController.createDepartment);
router.get('/departments', auth(), academicController.getAllDepartments);

// Semester Registration Routes
router.post('/registrations', auth(['student']), academicController.createSemesterRegistration);
router.put('/registrations/:registrationId/status', auth(['admin', 'faculty']), academicController.updateRegistrationStatus);
router.get('/registrations', auth(['student']), academicController.getStudentRegistrations);
router.get('/registrations/student/:studentId', auth(['admin', 'faculty']), academicController.getStudentRegistrations);

module.exports = router;
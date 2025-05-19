const AcademicModel = require('../models/academicModel');

// Academic Session Controllers
exports.createAcademicSession = async (req, res) => {
  try {
    const { session_name, start_date, end_date } = req.body;
    const created_by = req.user.id;
    
    const sessionId = await AcademicModel.createAcademicSession({
      session_name,
      start_date,
      end_date,
      created_by
    });
    
    res.status(201).json({
      message: 'Academic session created successfully',
      sessionId
    });
  } catch (error) {
    console.error('Create academic session error:', error);
    res.status(500).json({ message: 'Server error while creating academic session' });
  }
};

exports.getCurrentSession = async (req, res) => {
  try {
    const session = await AcademicModel.getCurrentSession();
    if (!session) {
      return res.status(404).json({ message: 'No current academic session found' });
    }
    res.json(session);
  } catch (error) {
    console.error('Get current session error:', error);
    res.status(500).json({ message: 'Server error while fetching current session' });
  }
};

exports.setCurrentSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    await AcademicModel.setCurrentSession(sessionId);
    res.json({ message: 'Current session updated successfully' });
  } catch (error) {
    console.error('Set current session error:', error);
    res.status(500).json({ message: 'Server error while updating current session' });
  }
};

// Department Controllers
exports.createDepartment = async (req, res) => {
  try {
    const { department_code, department_name, hod_faculty_id, description } = req.body;
    
    const departmentId = await AcademicModel.createDepartment({
      department_code,
      department_name,
      hod_faculty_id,
      description
    });
    
    res.status(201).json({
      message: 'Department created successfully',
      departmentId
    });
  } catch (error) {
    console.error('Create department error:', error);
    res.status(500).json({ message: 'Server error while creating department' });
  }
};

exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await AcademicModel.getAllDepartments();
    res.json(departments);
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ message: 'Server error while fetching departments' });
  }
};

// Semester Registration Controllers
exports.createSemesterRegistration = async (req, res) => {
  try {
    const { semester, academic_session_id } = req.body;
    const student_id = req.user.id;
    
    const registrationId = await AcademicModel.createSemesterRegistration({
      student_id,
      semester,
      academic_session_id
    });
    
    res.status(201).json({
      message: 'Semester registration created successfully',
      registrationId
    });
  } catch (error) {
    console.error('Create semester registration error:', error);
    res.status(500).json({ message: 'Server error while creating semester registration' });
  }
};

exports.updateRegistrationStatus = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const { status, remarks } = req.body;
    
    await AcademicModel.updateRegistrationStatus(registrationId, status, remarks);
    
    res.json({ message: 'Registration status updated successfully' });
  } catch (error) {
    console.error('Update registration status error:', error);
    res.status(500).json({ message: 'Server error while updating registration status' });
  }
};

exports.getStudentRegistrations = async (req, res) => {
  try {
    const student_id = req.params.studentId || req.user.id;
    const registrations = await AcademicModel.getStudentRegistrations(student_id);
    res.json(registrations);
  } catch (error) {
    console.error('Get student registrations error:', error);
    res.status(500).json({ message: 'Server error while fetching registrations' });
  }
};
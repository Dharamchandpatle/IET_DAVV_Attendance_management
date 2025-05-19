const pool = require('../config/db');

// Academic Session Management
exports.createAcademicSession = async (sessionData) => {
  const { session_name, start_date, end_date, created_by } = sessionData;
  
  const [result] = await pool.execute(
    'INSERT INTO academic_sessions (session_name, start_date, end_date, created_by) VALUES (?, ?, ?, ?)',
    [session_name, start_date, end_date, created_by]
  );
  
  return result.insertId;
};

exports.getCurrentSession = async () => {
  const [sessions] = await pool.execute(
    'SELECT * FROM academic_sessions WHERE is_current = TRUE LIMIT 1'
  );
  return sessions[0];
};

exports.setCurrentSession = async (sessionId) => {
  await pool.execute('UPDATE academic_sessions SET is_current = FALSE WHERE is_current = TRUE');
  await pool.execute('UPDATE academic_sessions SET is_current = TRUE WHERE id = ?', [sessionId]);
};

// Department Management
exports.createDepartment = async (departmentData) => {
  const { department_code, department_name, hod_faculty_id, description } = departmentData;
  
  const [result] = await pool.execute(
    'INSERT INTO departments (department_code, department_name, hod_faculty_id, description) VALUES (?, ?, ?, ?)',
    [department_code, department_name, hod_faculty_id, description]
  );
  
  return result.insertId;
};

exports.getAllDepartments = async () => {
  const [departments] = await pool.execute(`
    SELECT d.*, CONCAT(u.first_name, ' ', u.last_name) as hod_name 
    FROM departments d 
    LEFT JOIN faculty f ON d.hod_faculty_id = f.id 
    LEFT JOIN users u ON f.user_id = u.id
  `);
  return departments;
};

// Semester Registration
exports.createSemesterRegistration = async (registrationData) => {
  const { student_id, semester, academic_session_id } = registrationData;
  
  const [result] = await pool.execute(
    'INSERT INTO semester_registrations (student_id, semester, academic_session_id) VALUES (?, ?, ?)',
    [student_id, semester, academic_session_id]
  );
  
  return result.insertId;
};

exports.updateRegistrationStatus = async (registrationId, status, remarks) => {
  await pool.execute(
    'UPDATE semester_registrations SET status = ?, remarks = ? WHERE id = ?',
    [status, remarks, registrationId]
  );
};

exports.getStudentRegistrations = async (studentId) => {
  const [registrations] = await pool.execute(`
    SELECT sr.*, as.session_name 
    FROM semester_registrations sr 
    JOIN academic_sessions as ON sr.academic_session_id = as.id 
    WHERE sr.student_id = ?
  `, [studentId]);
  return registrations;
};
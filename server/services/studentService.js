const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
const User = require('../models/User');
const { generateToken } = require('../utils/jwtUtils');
const {
  getMissingFields,
  isInstitutionEmail,
  isStrongPassword,
  isValidEmail
} = require('../utils/validators');

const registerStudent = async (payload) => {
  const requiredFields = [
    'name',
    'email',
    'password',
    'roll_number',
    'department_id',
    'semester',
    'section',
    'admission_year'
  ];

  const missing = getMissingFields(payload, requiredFields);
  if (missing.length) {
    const error = new Error(`Missing required fields: ${missing.join(', ')}`);
    error.status = 400;
    throw error;
  }

  if (!isValidEmail(payload.email) || !isInstitutionEmail(payload.email)) {
    const error = new Error('Email must end with @ietdavv.edu.in');
    error.status = 400;
    throw error;
  }

  if (!isStrongPassword(payload.password)) {
    const error = new Error('Password must be at least 8 characters long');
    error.status = 400;
    throw error;
  }

  const result = await Student.createWithUser(payload);
  const token = generateToken({ id: result.userId, role: 'student' });

  return {
    token,
    userId: result.userId,
    studentId: result.studentId
  };
};

const loginStudent = async ({ email, password }) => {
  const missing = getMissingFields({ email, password }, ['email', 'password']);
  if (missing.length) {
    const error = new Error('Email and password are required');
    error.status = 400;
    throw error;
  }

  const user = await User.findUserByEmail(email);
  if (!user || user.role !== 'student') {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  await User.updateLastLogin(user.id);
  const student = await Student.findByUserId(user.id);
  const token = generateToken({ id: user.id, role: user.role });

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    student
  };
};

const getAllStudents = async () => {
  return Student.findAll();
};

const getStudentById = async (id) => {
  return Student.findById(id);
};

const updateStudent = async (id, userUpdates, studentUpdates) => {
  return Student.updateById(id, userUpdates, studentUpdates);
};

const deleteStudent = async (id) => {
  return Student.deleteById(id);
};

module.exports = {
  registerStudent,
  loginStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent
};

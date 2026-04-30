const bcrypt = require('bcryptjs');
const Faculty = require('../models/Faculty');
const User = require('../models/User');
const { generateToken } = require('../utils/jwtUtils');
const {
  getMissingFields,
  isInstitutionEmail,
  isStrongPassword,
  isValidEmail
} = require('../utils/validators');

const registerFaculty = async (payload) => {
  const requiredFields = [
    'name',
    'email',
    'password',
    'faculty_code',
    'department_id',
    'designation',
    'joining_date'
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

  const result = await Faculty.createWithUser(payload);
  const token = generateToken({ id: result.userId, role: 'faculty' });

  return {
    token,
    userId: result.userId,
    facultyId: result.facultyId
  };
};

const loginFaculty = async ({ email, password }) => {
  const missing = getMissingFields({ email, password }, ['email', 'password']);
  if (missing.length) {
    const error = new Error('Email and password are required');
    error.status = 400;
    throw error;
  }

  const user = await User.findUserByEmail(email);
  if (!user || user.role !== 'faculty') {
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
  const faculty = await Faculty.findByUserId(user.id);
  const token = generateToken({ id: user.id, role: user.role });

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    faculty
  };
};

const getAllFaculty = async () => {
  return Faculty.findAll();
};

const getFacultyById = async (id) => {
  return Faculty.findById(id);
};

const updateFaculty = async (id, userUpdates, facultyUpdates) => {
  return Faculty.updateById(id, userUpdates, facultyUpdates);
};

const deleteFaculty = async (id) => {
  return Faculty.deleteById(id);
};

module.exports = {
  registerFaculty,
  loginFaculty,
  getAllFaculty,
  getFacultyById,
  updateFaculty,
  deleteFaculty
};

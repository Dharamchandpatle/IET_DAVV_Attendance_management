const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const { generateToken, verifyToken } = require('../utils/jwtUtils');
const {
  getMissingFields,
  isInstitutionEmail,
  isStrongPassword,
  isValidEmail,
  isValidRole
} = require('../utils/validators');

// Get user details based on role
const getUserDetails = async (user) => {
  try {
    if (user.role === 'student') {
      const students = await Student.findByUserId(user.id);
      return students && students.length > 0 ? students[0] : null;
    }
    if (user.role === 'faculty') {
      const faculty = await Faculty.findByUserId(user.id);
      return faculty && faculty.length > 0 ? faculty[0] : null;
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
  }
  return null;
};

// Register a new student
const registerStudent = async (payload) => {
  const requiredFields = ['name', 'email', 'password', 'roll_number', 'department_id', 'semester', 'section', 'admission_year'];
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
    const error = new Error('Password must be at least 8 characters');
    error.status = 400;
    throw error;
  }

  try {
    const result = await Student.createWithUser(payload);
    const student = await Student.findByUserId(result.userId);
    
    return {
      token: generateToken({ id: result.userId, role: 'student' }),
      user: {
        id: result.userId,
        name: payload.name,
        email: payload.email,
        role: 'student',
        ...student[0]
      }
    };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      const message = error.message.includes('roll_number')
        ? 'Roll number already exists'
        : 'Email already exists';
      const err = new Error(message);
      err.status = 409;
      throw err;
    }
    throw error;
  }
};

// Register a new faculty
const registerFaculty = async (payload) => {
  const requiredFields = ['name', 'email', 'password', 'faculty_code', 'department_id', 'designation', 'joining_date'];
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
    const error = new Error('Password must be at least 8 characters');
    error.status = 400;
    throw error;
  }

  try {
    const result = await Faculty.createWithUser(payload);
    const faculty = await Faculty.findByUserId(result.userId);
    
    return {
      token: generateToken({ id: result.userId, role: 'faculty' }),
      user: {
        id: result.userId,
        name: payload.name,
        email: payload.email,
        role: 'faculty',
        ...faculty[0]
      }
    };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      const message = error.message.includes('faculty_code')
        ? 'Faculty code already exists'
        : 'Email already exists';
      const err = new Error(message);
      err.status = 409;
      throw err;
    }
    throw error;
  }
};

// Register a new admin
const registerAdmin = async (payload) => {
  const requiredFields = ['name', 'email', 'password'];
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
    const error = new Error('Password must be at least 8 characters');
    error.status = 400;
    throw error;
  }

  try {
    const result = await User.createUser(payload.name, payload.email, payload.password, 'admin');
    return {
      token: generateToken({ id: result.insertId, role: 'admin' }),
      user: {
        id: result.insertId,
        name: payload.name,
        email: payload.email,
        role: 'admin'
      }
    };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      const err = new Error('Email already exists');
      err.status = 409;
      throw err;
    }
    throw error;
  }
};

// Unified registration handler
const registerUser = async (payload) => {
  const { role } = payload;

  if (!isValidRole(role)) {
    const error = new Error('Invalid role. Must be student, faculty, or admin');
    error.status = 400;
    throw error;
  }

  if (role === 'student') {
    return registerStudent(payload);
  } else if (role === 'faculty') {
    return registerFaculty(payload);
  } else if (role === 'admin') {
    return registerAdmin(payload);
  }
};

// Login user
const loginUser = async ({ email, password, role }) => {
  const missing = getMissingFields({ email, password }, ['email', 'password']);
  if (missing.length) {
    const error = new Error('Email and password are required');
    error.status = 400;
    throw error;
  }

  const user = await User.findUserByEmail(email);
  if (!user) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  if (role && user.role !== role) {
    const error = new Error('Invalid role for this account');
    error.status = 403;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  // Update last login
  await User.updateLastLogin(user.id);

  // Get role-specific details
  const roleDetails = await getUserDetails(user);

  const userResponse = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    ...(roleDetails || {})
  };

  return {
    token: generateToken({ id: user.id, role: user.role }),
    user: userResponse
  };
};

// Refresh token
const refreshToken = async (token) => {
  if (!token) {
    const error = new Error('Token is required');
    error.status = 400;
    throw error;
  }

  const decoded = verifyToken(token);
  const newToken = generateToken({ id: decoded.id, role: decoded.role });
  return { token: newToken };
};

module.exports = {
  registerUser,
  loginUser,
  refreshToken
};

const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken, verifyToken } = require('../utils/jwtUtils');
const {
  getMissingFields,
  isInstitutionEmail,
  isStrongPassword,
  isValidEmail,
  isValidRole
} = require('../utils/validators');

const registerUser = async (payload) => {
  const missing = getMissingFields(payload, ['name', 'email', 'password', 'role']);
  if (missing.length) {
    const message = `Missing required fields: ${missing.join(', ')}`;
    const error = new Error(message);
    error.status = 400;
    throw error;
  }

  if (!isValidEmail(payload.email) || !isInstitutionEmail(payload.email)) {
    const error = new Error('Email must end with @ietdavv.edu.in');
    error.status = 400;
    throw error;
  }

  if (!isValidRole(payload.role)) {
    const error = new Error('Invalid role. Must be student, faculty, or admin');
    error.status = 400;
    throw error;
  }

  if (!isStrongPassword(payload.password)) {
    const error = new Error('Password must be at least 8 characters long');
    error.status = 400;
    throw error;
  }

  const result = await User.createUser(
    payload.name,
    payload.email,
    payload.password,
    payload.role,
    payload.phone,
    payload.profile_image
  );

  const user = {
    id: result.insertId,
    name: payload.name,
    email: payload.email,
    role: payload.role
  };

  return {
    token: generateToken(user),
    user
  };
};

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

  await User.updateLastLogin(user.id);

  return {
    token: generateToken({ id: user.id, role: user.role }),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

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

const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');

const { generateToken, verifyToken } = require('../utils/jwtUtils');

// ============================================
// Attach role-specific profile
// ============================================

async function attachRoleProfile(userRow) {
  if (!userRow) return null;

  const base = {
    id: userRow.id,
    name: userRow.name,
    email: userRow.email,
    role: userRow.role,
    phone: userRow.phone
  };

  try {
    if (userRow.role === 'student') {
      const profile = await Student.findByUserId(userRow.id);

      if (profile) {
        return {
          ...base,
          profile
        };
      }
    }

    if (userRow.role === 'faculty') {
      const profile = await Faculty.findByUserId(userRow.id);

      if (profile) {
        return {
          ...base,
          profile
        };
      }
    }
  } catch (err) {
    console.error('attachRoleProfile error:', err.message);
  }

  return base;
}

// ============================================
// Register User
// ============================================

async function registerUser(payload) {
  const { name, email, password, role } = payload;

  // Required fields validation
  if (!name || !email || !password || !role) {
    const err = new Error(
      'name, email, password and role are required'
    );
    err.status = 400;
    throw err;
  }

  // Email validation
  if (!email.endsWith('@ietdavv.edu.in')) {
    const err = new Error(
      'Email must end with @ietdavv.edu.in'
    );
    err.status = 400;
    throw err;
  }

  try {
    // ============================================
    // Student Registration
    // ============================================

    if (role === 'student') {
      const result = await Student.createWithUser(payload);

      const user = await User.findById(result.userId);

      const token = generateToken({
        id: result.userId,
        role: 'student'
      });

      const userData = await attachRoleProfile(user);

      return {
        token,
        user: userData
      };
    }

    // ============================================
    // Faculty Registration
    // ============================================

    if (role === 'faculty') {
      const result = await Faculty.createWithUser(payload);

      const user = await User.findById(result.userId);

      const token = generateToken({
        id: result.userId,
        role: 'faculty'
      });

      const userData = await attachRoleProfile(user);

      return {
        token,
        user: userData
      };
    }

    // ============================================
    // Admin Registration
    // ============================================

    if (role === 'admin') {
      const result = await User.create({
        name,
        email,
        password,
        role
      });

      const user = await User.findById(result.insertId);

      const token = generateToken({
        id: result.insertId,
        role: 'admin'
      });

      return {
        token,
        user
      };
    }

    // Invalid role
    const err = new Error(
      'Invalid role. Must be student, faculty or admin'
    );
    err.status = 400;
    throw err;

  } catch (error) {

    // Duplicate email
    if (error.code === 'ER_DUP_ENTRY') {
      const err = new Error('Email already exists');
      err.status = 409;
      throw err;
    }

    throw error;
  }
}

// ============================================
// Login User
// ============================================

async function loginUser({ email, password, role }) {

  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : email;
  const normalizedRole = typeof role === 'string' ? role.trim().toLowerCase() : role;

  console.log('[auth:login] normalized input:', {
    email: normalizedEmail,
    role: normalizedRole,
    hasPassword: Boolean(password)
  });

  if (!normalizedEmail || !password) {
    const err = new Error(
      'Email and password are required'
    );

    err.status = 400;
    throw err;
  }

  // Find user
  const userRow = await User.findByEmail(normalizedEmail);

  console.log('[auth:login] sql user lookup result:', userRow ? {
    id: userRow.id,
    name: userRow.name,
    email: userRow.email,
    role: userRow.role,
    is_active: userRow.is_active,
    password: '[redacted]'
  } : null);

  if (!userRow) {
    const err = new Error(
      'No account found for this email'
    );

    err.status = 404;
    throw err;
  }

  // Role validation
  if (normalizedRole && userRow.role !== normalizedRole) {
    const err = new Error(
      'Invalid role for this account'
    );

    err.status = 403;
    throw err;
  }

  if (Number(userRow.is_active) === 0) {
    const err = new Error('Account is disabled');
    err.status = 403;
    throw err;
  }

  // Password compare
  const isPasswordValid = await bcrypt.compare(
    password,
    userRow.password
  );

  console.log('[auth:login] password comparison result:', {
    userId: userRow.id,
    isPasswordValid
  });

  if (!isPasswordValid) {
    const err = new Error(
      'Invalid email or password'
    );

    err.status = 401;
    throw err;
  }

  // Update last login
  await User.updateLastLogin(userRow.id);

  // Attach profile
  const user = await attachRoleProfile(userRow);

  // Generate token
  const token = generateToken({
    id: userRow.id,
    role: userRow.role
  });

  console.log('[auth:login] generated jwt:', {
    userId: userRow.id,
    role: userRow.role,
    tokenPreview: token.slice(0, 20) + '...'
  });

  const response = {
    token,
    user
  };

  console.log('[auth:login] final payload:', {
    userId: response.user?.id,
    role: response.user?.role
  });

  return response;
}

// ============================================
// Refresh Token
// ============================================

async function refreshToken(token) {

  if (!token) {
    const err = new Error('Token required');

    err.status = 400;
    throw err;
  }

  const decoded = verifyToken(token);

  const newToken = generateToken({
    id: decoded.id,
    role: decoded.role
  });

  return {
    token: newToken
  };
}

// ============================================
// Exports
// ============================================

module.exports = {
  registerUser,
  loginUser,
  refreshToken
};
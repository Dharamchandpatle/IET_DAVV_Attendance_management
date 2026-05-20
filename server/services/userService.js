const User = require('../models/User');
const { getMissingFields, isValidRole } = require('../utils/validators');

// Fetches a user by email.
const getUserByEmail = async (email) => {
  return User.findUserByEmail(email);
};

// Fetches a user by ID.
const getUserById = async (id) => {
  return User.findUserById(id);
};

// Returns all users.
const getAllUsers = async () => {
  return User.getAllUsers();
};

// Updates a user's profile details.
const updateUser = async (id, payload) => {
  const missing = getMissingFields(payload, ['name', 'email']);
  if (missing.length) {
    const error = new Error('Name and email are required');
    error.status = 400;
    throw error;
  }

  return User.updateUser(
    id,
    payload.name,
    payload.email,
    payload.phone,
    payload.is_active
  );
};

// Updates a user's role after validation.
const updateUserRole = async (id, role) => {
  if (!isValidRole(role)) {
    const error = new Error('Invalid role. Must be student, faculty, or admin');
    error.status = 400;
    throw error;
  }

  return User.updateUserRole(id, role);
};

// Records the user's most recent login time.
const updateLastLogin = async (id) => {
  return User.updateLastLogin(id);
};

// Removes a user by ID.
const deleteUser = async (id) => {
  return User.deleteUser(id);
};

module.exports = {
  getUserByEmail,
  getUserById,
  getAllUsers,
  updateUser,
  updateUserRole,
  updateLastLogin,
  deleteUser
};

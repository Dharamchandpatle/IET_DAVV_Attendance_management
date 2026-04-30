const User = require('../models/User');
const { getMissingFields, isValidRole } = require('../utils/validators');

const getUserByEmail = async (email) => {
  return User.findUserByEmail(email);
};

const getUserById = async (id) => {
  return User.findUserById(id);
};

const getAllUsers = async () => {
  return User.getAllUsers();
};

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
    payload.profile_image,
    payload.is_active
  );
};

const updateUserRole = async (id, role) => {
  if (!isValidRole(role)) {
    const error = new Error('Invalid role. Must be student, faculty, or admin');
    error.status = 400;
    throw error;
  }

  return User.updateUserRole(id, role);
};

const updateLastLogin = async (id) => {
  return User.updateLastLogin(id);
};

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

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

// Returns all faculty members.
const getAllFaculty = async () => {
  return Faculty.findAll();
};

// Fetches a faculty member by ID.
const getFacultyById = async (id) => {
  return Faculty.findById(id);
};

// Fetches a faculty member by user id.
const getFacultyByUserId = async (userId) => {
  return Faculty.findByUserId(userId);
};

// Updates user and faculty details for a faculty record.
const updateFaculty = async (id, userUpdates, facultyUpdates) => {
  return Faculty.updateById(id, userUpdates, facultyUpdates);
};

// Removes a faculty member by ID.
const deleteFaculty = async (id) => {
  return Faculty.deleteById(id);
};

// Create a new faculty (user + faculty rows)
const createFaculty = async (payload) => {
  const result = await Faculty.createWithUser(payload);
  const faculty = await Faculty.findById(result.facultyId);
  return faculty;
};

module.exports = {
  getAllFaculty,
  getFacultyById,
  getFacultyByUserId,
  updateFaculty,
  deleteFaculty,
  createFaculty
};

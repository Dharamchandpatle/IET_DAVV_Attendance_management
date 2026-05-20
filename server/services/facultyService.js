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

// Updates user and faculty details for a faculty record.
const updateFaculty = async (id, userUpdates, facultyUpdates) => {
  return Faculty.updateById(id, userUpdates, facultyUpdates);
};

// Removes a faculty member by ID.
const deleteFaculty = async (id) => {
  return Faculty.deleteById(id);
};

module.exports = {
  getAllFaculty,
  getFacultyById,
  updateFaculty,
  deleteFaculty
};

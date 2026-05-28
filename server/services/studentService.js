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

// Returns all students.
const getAllStudents = async () => {
  return Student.findAll();
};

// Fetches a student by ID.
const getStudentById = async (id) => {
  return Student.findById(id);
};

// Fetch student by user id
const getStudentByUserId = async (userId) => {
  return Student.findByUserId(userId);
};

// Updates user and student details for a student record.
const updateStudent = async (id, userUpdates, studentUpdates) => {
  return Student.updateById(id, userUpdates, studentUpdates);
};

// Removes a student by ID.
const deleteStudent = async (id) => {
  return Student.deleteById(id);
};

// Create a new student (user + student rows)
const createStudent = async (payload) => {
  // Student.createWithUser will perform validation and transaction
  const result = await Student.createWithUser(payload);
  // Return the created student record for convenience
  const student = await Student.findById(result.studentId);
  return student;
};

module.exports = {
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  createStudent
};

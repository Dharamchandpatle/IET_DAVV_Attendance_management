const { query } = require('../config/db');

// Minimal model helpers for attendance_records table.
const insertOrUpdateRecord = async ({ course_assignment_id = null, course_id = null, faculty_id = null, student_id, date, semester = null, academic_year = null, status, marked_by, remarks = null }) => {
  return query(
    `INSERT INTO attendance_records (course_assignment_id, course_id, faculty_id, student_id, date, semester, academic_year, status, marked_by, remarks)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE status = VALUES(status), remarks = VALUES(remarks), updated_at = CURRENT_TIMESTAMP`,
    [course_assignment_id, course_id, faculty_id, student_id, date, semester, academic_year, status, marked_by, remarks]
  );
};

const findByStudentId = async (studentId) => {
  return query(
    `SELECT id, course_assignment_id, course_id, faculty_id, date AS class_date, semester, academic_year, status, remarks, marked_by, created_at
     FROM attendance_records WHERE student_id = ? ORDER BY date DESC`,
    [studentId]
  );
};

module.exports = {
  insertOrUpdateRecord,
  findByStudentId
};

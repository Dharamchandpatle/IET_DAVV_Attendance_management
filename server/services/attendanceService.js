const { query } = require('../config/db');

// Allowed attendance statuses.
const VALID_STATUSES = ['present', 'absent', 'late'];

// Saves attendance records for a class date and into the normalized attendance_records table.
const markClassAttendance = async ({ class_date, records, attendance_type, marked_by, course_id, faculty_id, semester, academic_year }) => {
  if (!class_date || !Array.isArray(records) || records.length === 0) {
    const error = new Error('Class date and attendance records are required');
    error.status = 400;
    throw error;
  }

  if (!marked_by) {
    const error = new Error('Marked_by (user id) is required');
    error.status = 400;
    throw error;
  }

  records.forEach((record) => {
    if (!record.user_id || !VALID_STATUSES.includes(record.status)) {
      const error = new Error('Each record must include user_id and a valid status');
      error.status = 400;
      throw error;
    }
  });

  // For each record, map user_id -> student_id then insert/update attendance_records
  await Promise.all(
    records.map(async (record) => {
      // allow record.student_id (students.id) if provided, otherwise resolve via user_id
      let studentId = record.student_id || null;
      if (!studentId) {
        const rows = await query('SELECT id FROM students WHERE user_id = ?', [record.user_id]);
        if (!rows || rows.length === 0) {
          // skip if student mapping not found
          return null;
        }
        studentId = rows[0].id;
      }

      // Resolve faculty_id from marked_by (user) if not explicitly provided
      let resolvedFacultyId = faculty_id || null;
      if (!resolvedFacultyId) {
        const frows = await query('SELECT id FROM faculty WHERE user_id = ?', [marked_by]);
        if (frows && frows.length) resolvedFacultyId = frows[0].id;
      }

      return query(
        `INSERT INTO attendance_records (course_assignment_id, course_id, faculty_id, student_id, date, semester, academic_year, status, marked_by, remarks)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE status = VALUES(status), remarks = VALUES(remarks), updated_at = CURRENT_TIMESTAMP`,
        [null, course_id || null, resolvedFacultyId, studentId, class_date, semester || null, academic_year || null, record.status, marked_by, record.remarks || null]
      );
    })
  );

  return { total: records.length };
};

// Fetches attendance history for a user (returns attendance_records entries filtered by student mapping)
const getAttendanceForUser = async (userId) => {
  // Find student id from user id
  const studentRows = await query('SELECT id FROM students WHERE user_id = ?', [userId]);
  if (!studentRows || studentRows.length === 0) return [];
  const studentId = studentRows[0].id;

  return query(
    `SELECT id, course_assignment_id, course_id, faculty_id, date AS class_date, semester, academic_year, status, remarks, marked_by, created_at
     FROM attendance_records
     WHERE student_id = ?
     ORDER BY date DESC`,
    [studentId]
  );
};

module.exports = {
  markClassAttendance,
  getAttendanceForUser
};

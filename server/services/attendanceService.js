const { query } = require('../config/db');

const VALID_STATUSES = ['present', 'absent', 'late'];

const markClassAttendance = async ({ class_date, records }) => {
  if (!class_date || !Array.isArray(records) || records.length === 0) {
    const error = new Error('Class date and attendance records are required');
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

  await Promise.all(
    records.map((record) =>
      query(
        'INSERT INTO class_attendance (user_id, class_date, status) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE status = VALUES(status)',
        [record.user_id, class_date, record.status]
      )
    )
  );

  return { total: records.length };
};

const getAttendanceForUser = async (userId) => {
  return query(
    'SELECT class_date, status FROM class_attendance WHERE user_id = ? ORDER BY class_date DESC',
    [userId]
  );
};

module.exports = {
  markClassAttendance,
  getAttendanceForUser
};

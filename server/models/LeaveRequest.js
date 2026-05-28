const { query } = require('../config/db');

const create = async ({ student_id, start_date, end_date, reason, type, document_urls = [] }) => {
  const result = await query(
    'INSERT INTO leave_requests (student_id, start_date, end_date, reason, type, document_urls) VALUES (?, ?, ?, ?, ?, ?)',
    [student_id, start_date, end_date, reason, type, JSON.stringify(document_urls)]
  );
  return { id: result.insertId };
};

const findById = async (id) => {
  const rows = await query('SELECT * FROM leave_requests WHERE id = ?', [id]);
  return rows[0] || null;
};

const list = async (whereClause = '', params = []) => {
  const rows = await query(`SELECT * FROM leave_requests ${whereClause} ORDER BY created_at DESC`, params);
  return rows;
};

const updateStatus = async (id, status, review_comment = null, reviewed_by = null) => {
  return query('UPDATE leave_requests SET status = ?, review_comment = ?, reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP WHERE id = ?', [status, review_comment, reviewed_by, id]);
};

module.exports = {
  create,
  findById,
  list,
  updateStatus
};

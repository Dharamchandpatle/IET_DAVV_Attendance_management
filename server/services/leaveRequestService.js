const { query } = require('../config/db');
const Student = require('../models/Student');

const VALID_STATUSES = ['pending', 'approved', 'rejected', 'cancelled'];
const VALID_TYPES = ['medical', 'personal', 'family', 'other'];

const createLeaveRequest = async (userId, payload) => {
  const student = await Student.findByUserId(userId);
  if (!student) {
    const error = new Error('Student profile not found');
    error.status = 404;
    throw error;
  }

  if (!payload.start_date || !payload.end_date || !payload.reason || !payload.type) {
    const error = new Error('Start date, end date, reason, and type are required');
    error.status = 400;
    throw error;
  }

  if (new Date(payload.end_date) < new Date(payload.start_date)) {
    const error = new Error('End date cannot be earlier than start date');
    error.status = 400;
    throw error;
  }

  if (!VALID_TYPES.includes(payload.type)) {
    const error = new Error('Invalid leave type');
    error.status = 400;
    throw error;
  }

  const documentUrls = Array.isArray(payload.document_urls) ? payload.document_urls : [];

  const result = await query(
    'INSERT INTO leave_requests (student_id, start_date, end_date, reason, type, document_urls) VALUES (?, ?, ?, ?, ?, ?)',
    [student.id, payload.start_date, payload.end_date, payload.reason, payload.type, JSON.stringify(documentUrls)]
  );

  return { id: result.insertId };
};

const listLeaveRequests = async ({ role, userId, status, type }) => {
  if (status && !VALID_STATUSES.includes(status)) {
    const error = new Error('Invalid leave request status');
    error.status = 400;
    throw error;
  }

  if (type && !VALID_TYPES.includes(type)) {
    const error = new Error('Invalid leave request type');
    error.status = 400;
    throw error;
  }

  let studentId = null;
  if (role === 'student') {
    const student = await Student.findByUserId(userId);
    if (!student) {
      const error = new Error('Student profile not found');
      error.status = 404;
      throw error;
    }
    studentId = student.id;
  }

  const conditions = [];
  const params = [];

  if (studentId) {
    conditions.push('lr.student_id = ?');
    params.push(studentId);
  }

  if (status) {
    conditions.push('lr.status = ?');
    params.push(status);
  }

  if (type) {
    conditions.push('lr.type = ?');
    params.push(type);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const rows = await query(
    `SELECT lr.*, s.roll_number, u.name AS student_name, u.email AS student_email
     FROM leave_requests lr
     JOIN students s ON lr.student_id = s.id
     JOIN users u ON s.user_id = u.id
     ${whereClause}
     ORDER BY lr.created_at DESC`,
    params
  );

  return rows.map((row) => {
    let documentUrls = [];
    if (Array.isArray(row.document_urls)) {
      documentUrls = row.document_urls;
    } else if (typeof row.document_urls === 'string') {
      try {
        documentUrls = JSON.parse(row.document_urls);
      } catch (error) {
        documentUrls = [];
      }
    }

    return {
      ...row,
      document_urls: documentUrls
    };
  });
};

const updateLeaveStatus = async (id, { status, review_comment, reviewerUserId }) => {
  if (!VALID_STATUSES.includes(status)) {
    const error = new Error('Invalid leave request status');
    error.status = 400;
    throw error;
  }

  const facultyRows = await query('SELECT id FROM faculty WHERE user_id = ?', [reviewerUserId]);
  const facultyId = facultyRows[0]?.id ?? null;

  const result = await query(
    'UPDATE leave_requests SET status = ?, review_comment = ?, reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP WHERE id = ?',
    [status, review_comment || null, facultyId, id]
  );

  return result;
};

module.exports = {
  createLeaveRequest,
  listLeaveRequests,
  updateLeaveStatus
};

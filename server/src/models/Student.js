const { pool } = require('../config/database');
const User = require('./User');

class Student extends User {
  static async create({ name, email, password, department, rollNo, semester }) {
    const userId = await super.create({ 
      name, 
      email, 
      password, 
      role: 'student',
      department 
    });

    const [result] = await pool.execute(
      'INSERT INTO students (user_id, roll_no, semester) VALUES (?, ?, ?)',
      [userId, rollNo, semester]
    );

    return {
      userId,
      studentId: result.insertId
    };
  }

  static async findByUserId(userId) {
    const [rows] = await pool.execute(
      `SELECT s.*, u.name, u.email, u.department 
       FROM students s 
       JOIN users u ON s.user_id = u.id 
       WHERE s.user_id = ?`,
      [userId]
    );
    return rows[0];
  }

  static async updateProfile(userId, updates) {
    const userUpdates = {};
    const studentUpdates = {};

    // Separate updates for user and student tables
    Object.entries(updates).forEach(([key, value]) => {
      if (['name', 'email', 'department'].includes(key)) {
        userUpdates[key] = value;
      } else if (['semester'].includes(key)) {
        studentUpdates[key] = value;
      }
    });

    // Update user table if needed
    if (Object.keys(userUpdates).length > 0) {
      await super.updateProfile(userId, userUpdates);
    }

    // Update student table if needed
    if (Object.keys(studentUpdates).length > 0) {
      const setClauses = Object.keys(studentUpdates)
        .map(key => `${key} = ?`)
        .join(', ');
      const values = [...Object.values(studentUpdates), userId];

      await pool.execute(
        `UPDATE students SET ${setClauses} WHERE user_id = ?`,
        values
      );
    }

    return this.findByUserId(userId);
  }

  static async getAttendance(studentId, { startDate, endDate, courseId } = {}) {
    let query = `
      SELECT a.*, c.name as course_name 
      FROM attendance a
      JOIN courses c ON a.course_id = c.id
      WHERE a.student_id = ?
    `;
    const params = [studentId];

    if (startDate) {
      query += ' AND a.date >= ?';
      params.push(startDate);
    }
    if (endDate) {
      query += ' AND a.date <= ?';
      params.push(endDate);
    }
    if (courseId) {
      query += ' AND a.course_id = ?';
      params.push(courseId);
    }

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async getLeaveRequests(studentId, status = null) {
    let query = 'SELECT * FROM leave_requests WHERE student_id = ?';
    const params = [studentId];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';
    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async submitLeaveRequest(studentId, { startDate, endDate, reason }) {
    const [result] = await pool.execute(
      'INSERT INTO leave_requests (student_id, start_date, end_date, reason) VALUES (?, ?, ?, ?)',
      [studentId, startDate, endDate, reason]
    );
    return result.insertId;
  }
}

module.exports = Student;
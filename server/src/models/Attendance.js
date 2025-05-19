// const { Pool } = require('pg');
const pool = require('../config/db');

class Attendance {
    static async create(studentId, courseId, date, status) {
        const query = `
            INSERT INTO attendance (student_id, course_id, date, status)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const values = [studentId, courseId, date, status];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async getByStudentId(studentId) {
        const query = `
            SELECT a.*, c.name as course_name 
            FROM attendance a
            JOIN courses c ON a.course_id = c.id
            WHERE a.student_id = $1
            ORDER BY a.date DESC
        `;
        const result = await pool.query(query, [studentId]);
        return result.rows;
    }

    static async getAttendanceSummary(studentId) {
        const query = `
            SELECT 
                COUNT(*) FILTER (WHERE status = 'present') as present,
                COUNT(*) FILTER (WHERE status = 'absent') as absent,
                COUNT(*) FILTER (WHERE status = 'leave') as leave,
                COUNT(*) as total
            FROM attendance
            WHERE student_id = $1
        `;
        const result = await pool.query(query, [studentId]);
        return result.rows[0];
    }

    static async getCourseAttendance(studentId, courseId) {
        const query = `
            SELECT 
                COUNT(*) FILTER (WHERE status = 'present') as present,
                COUNT(*) FILTER (WHERE status = 'absent') as absent
            FROM attendance
            WHERE student_id = $1 AND course_id = $2
        `;
        const result = await pool.query(query, [studentId, courseId]);
        return result.rows[0];
    }
}

module.exports = Attendance;
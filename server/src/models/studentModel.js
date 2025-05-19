const { pool } = require('../config/db');

class StudentModel {
  // Create a new student
  static async createStudent(userData, studentData) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Create user first
      const [userResult] = await connection.execute(
        'INSERT INTO users (email, password, role, first_name, last_name) VALUES (?, ?, ?, ?, ?)',
        [userData.email, userData.password, 'student', userData.firstName, userData.lastName]
      );
      
      const userId = userResult.insertId;
      
      // Create student record
      const [studentResult] = await connection.execute(
        'INSERT INTO students (user_id, student_id, department, semester, section) VALUES (?, ?, ?, ?, ?)',
        [userId, studentData.studentId, studentData.department, studentData.semester, studentData.section]
      );
      
      await connection.commit();
      
      return {
        userId,
        studentId: studentResult.insertId,
        ...userData,
        ...studentData
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  
  // Get student by ID
  static async getStudentById(id) {
    try {
      const [rows] = await pool.execute(
        `SELECT s.*, u.email, u.first_name, u.last_name, u.created_at
         FROM students s
         JOIN users u ON s.user_id = u.id
         WHERE s.id = ?`,
        [id]
      );
      
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }
  
  // Get student by user ID
  static async getStudentByUserId(userId) {
    try {
      const [rows] = await pool.execute(
        `SELECT s.*, u.email, u.first_name, u.last_name, u.created_at
         FROM students s
         JOIN users u ON s.user_id = u.id
         WHERE s.user_id = ?`,
        [userId]
      );
      
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }
  
  // Get all students with pagination
  static async getAllStudents(page = 1, limit = 10, filters = {}) {
    try {
      let query = `
        SELECT s.*, u.email, u.first_name, u.last_name, u.created_at
        FROM students s
        JOIN users u ON s.user_id = u.id
        WHERE 1=1
      `;
      
      const queryParams = [];
      
      // Apply filters
      if (filters.department) {
        query += ' AND s.department = ?';
        queryParams.push(filters.department);
      }
      
      if (filters.semester) {
        query += ' AND s.semester = ?';
        queryParams.push(filters.semester);
      }
      
      if (filters.section) {
        query += ' AND s.section = ?';
        queryParams.push(filters.section);
      }
      
      if (filters.search) {
        query += ' AND (u.first_name LIKE ? OR u.last_name LIKE ? OR s.student_id LIKE ?)';
        const searchTerm = `%${filters.search}%`;
        queryParams.push(searchTerm, searchTerm, searchTerm);
      }
      
      // Add pagination
      query += ' ORDER BY u.created_at DESC LIMIT ? OFFSET ?';
      const offset = (page - 1) * limit;
      queryParams.push(limit, offset);
      
      const [rows] = await pool.execute(query, queryParams);
      
      // Get total count for pagination
      let countQuery = `
        SELECT COUNT(*) as total
        FROM students s
        JOIN users u ON s.user_id = u.id
        WHERE 1=1
      `;
      
      const countParams = [];
      
      // Apply the same filters to count query
      if (filters.department) {
        countQuery += ' AND s.department = ?';
        countParams.push(filters.department);
      }
      
      if (filters.semester) {
        countQuery += ' AND s.semester = ?';
        countParams.push(filters.semester);
      }
      
      if (filters.section) {
        countQuery += ' AND s.section = ?';
        countParams.push(filters.section);
      }
      
      if (filters.search) {
        countQuery += ' AND (u.first_name LIKE ? OR u.last_name LIKE ? OR s.student_id LIKE ?)';
        const searchTerm = `%${filters.search}%`;
        countParams.push(searchTerm, searchTerm, searchTerm);
      }
      
      const [countResult] = await pool.execute(countQuery, countParams);
      const total = countResult[0].total;
      
      return {
        students: rows,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }
  
  // Update student
  static async updateStudent(id, studentData) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Get student to find user_id
      const [studentRows] = await connection.execute(
        'SELECT user_id FROM students WHERE id = ?',
        [id]
      );
      
      if (!studentRows.length) {
        throw new Error('Student not found');
      }
      
      const userId = studentRows[0].user_id;
      
      // Update user data
      if (studentData.firstName || studentData.lastName || studentData.email) {
        let userQuery = 'UPDATE users SET';
        const userParams = [];
        const userFields = [];
        
        if (studentData.firstName) {
          userFields.push(' first_name = ?');
          userParams.push(studentData.firstName);
        }
        
        if (studentData.lastName) {
          userFields.push(' last_name = ?');
          userParams.push(studentData.lastName);
        }
        
        if (studentData.email) {
          userFields.push(' email = ?');
          userParams.push(studentData.email);
        }
        
        userQuery += userFields.join(',') + ' WHERE id = ?';
        userParams.push(userId);
        
        await connection.execute(userQuery, userParams);
      }
      
      // Update student data
      if (studentData.department || studentData.semester || studentData.section) {
        let studentQuery = 'UPDATE students SET';
        const studentParams = [];
        const studentFields = [];
        
        if (studentData.department) {
          studentFields.push(' department = ?');
          studentParams.push(studentData.department);
        }
        
        if (studentData.semester) {
          studentFields.push(' semester = ?');
          studentParams.push(studentData.semester);
        }
        
        if (studentData.section) {
          studentFields.push(' section = ?');
          studentParams.push(studentData.section);
        }
        
        studentQuery += studentFields.join(',') + ' WHERE id = ?';
        studentParams.push(id);
        
        await connection.execute(studentQuery, studentParams);
      }
      
      await connection.commit();
      
      return this.getStudentById(id);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  
  // Delete student
  static async deleteStudent(id) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Get student to find user_id
      const [studentRows] = await connection.execute(
        'SELECT user_id FROM students WHERE id = ?',
        [id]
      );
      
      if (!studentRows.length) {
        throw new Error('Student not found');
      }
      
      const userId = studentRows[0].user_id;
      
      // Delete student record
      await connection.execute('DELETE FROM students WHERE id = ?', [id]);
      
      // Delete user record
      await connection.execute('DELETE FROM users WHERE id = ?', [userId]);
      
      await connection.commit();
      
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  
  // Get student attendance
  static async getStudentAttendance(studentId, filters = {}) {
    try {
      let query = `
        SELECT ca.*, c.course_code, c.course_name, cl.semester, cl.section
        FROM class_attendance ca
        JOIN classes cl ON ca.class_id = cl.id
        JOIN courses c ON cl.course_id = c.id
        WHERE ca.student_id = ?
      `;
      
      const queryParams = [studentId];
      
      // Apply filters
      if (filters.courseId) {
        query += ' AND c.id = ?';
        queryParams.push(filters.courseId);
      }
      
      if (filters.startDate) {
        query += ' AND ca.date >= ?';
        queryParams.push(filters.startDate);
      }
      
      if (filters.endDate) {
        query += ' AND ca.date <= ?';
        queryParams.push(filters.endDate);
      }
      
      if (filters.status) {
        query += ' AND ca.status = ?';
        queryParams.push(filters.status);
      }
      
      query += ' ORDER BY ca.date DESC';
      
      const [rows] = await pool.execute(query, queryParams);
      
      return rows;
    } catch (error) {
      throw error;
    }
  }
  
  // Get student exam attendance
  static async getStudentExamAttendance(studentId, filters = {}) {
    try {
      let query = `
        SELECT ea.*, e.exam_name, e.exam_date, c.course_code, c.course_name
        FROM exam_attendance ea
        JOIN exams e ON ea.exam_id = e.id
        JOIN courses c ON e.course_id = c.id
        WHERE ea.student_id = ?
      `;
      
      const queryParams = [studentId];
      
      // Apply filters
      if (filters.courseId) {
        query += ' AND c.id = ?';
        queryParams.push(filters.courseId);
      }
      
      if (filters.startDate) {
        query += ' AND e.exam_date >= ?';
        queryParams.push(filters.startDate);
      }
      
      if (filters.endDate) {
        query += ' AND e.exam_date <= ?';
        queryParams.push(filters.endDate);
      }
      
      if (filters.status) {
        query += ' AND ea.status = ?';
        queryParams.push(filters.status);
      }
      
      query += ' ORDER BY e.exam_date DESC';
      
      const [rows] = await pool.execute(query, queryParams);
      
      return rows;
    } catch (error) {
      throw error;
    }
  }
  
  // Get student leave requests
  static async getStudentLeaveRequests(studentId, status = null) {
    try {
      let query = `
        SELECT lr.*, u.first_name as reviewer_first_name, u.last_name as reviewer_last_name
        FROM leave_requests lr
        LEFT JOIN faculty f ON lr.reviewed_by = f.id
        LEFT JOIN users u ON f.user_id = u.id
        WHERE lr.student_id = ?
      `;
      
      const queryParams = [studentId];
      
      if (status) {
        query += ' AND lr.status = ?';
        queryParams.push(status);
      }
      
      query += ' ORDER BY lr.created_at DESC';
      
      const [rows] = await pool.execute(query, queryParams);
      
      return rows;
    } catch (error) {
      throw error;
    }
  }
  
  // Create leave request
  static async createLeaveRequest(studentId, leaveData) {
    try {
      const { startDate, endDate, reason } = leaveData;
      
      const [result] = await pool.execute(
        'INSERT INTO leave_requests (student_id, start_date, end_date, reason) VALUES (?, ?, ?, ?)',
        [studentId, startDate, endDate, reason]
      );
      
      return { id: result.insertId, studentId, startDate, endDate, reason, status: 'pending' };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = StudentModel; 
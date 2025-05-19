const { pool } = require('../config/db');

class FacultyModel {
  // Create a new faculty member
  static async createFaculty(userData, facultyData) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Create user first
      const [userResult] = await connection.execute(
        'INSERT INTO users (email, password, role, first_name, last_name) VALUES (?, ?, ?, ?, ?)',
        [userData.email, userData.password, 'faculty', userData.firstName, userData.lastName]
      );
      
      const userId = userResult.insertId;
      
      // Create faculty record
      const [facultyResult] = await connection.execute(
        'INSERT INTO faculty (user_id, faculty_id, department, designation) VALUES (?, ?, ?, ?)',
        [userId, facultyData.facultyId, facultyData.department, facultyData.designation]
      );
      
      await connection.commit();
      
      return {
        userId,
        facultyId: facultyResult.insertId,
        ...userData,
        ...facultyData
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  
  // Get faculty by ID
  static async getFacultyById(id) {
    try {
      const [rows] = await pool.execute(
        `SELECT f.*, u.email, u.first_name, u.last_name, u.created_at
         FROM faculty f
         JOIN users u ON f.user_id = u.id
         WHERE f.id = ?`,
        [id]
      );
      
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }
  
  // Get faculty by user ID
  static async getFacultyByUserId(userId) {
    try {
      const [rows] = await pool.execute(
        `SELECT f.*, u.email, u.first_name, u.last_name, u.created_at
         FROM faculty f
         JOIN users u ON f.user_id = u.id
         WHERE f.user_id = ?`,
        [userId]
      );
      
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }
  
  // Get all faculty with pagination
  static async getAllFaculty(page = 1, limit = 10, filters = {}) {
    try {
      let query = `
        SELECT f.*, u.email, u.first_name, u.last_name, u.created_at
        FROM faculty f
        JOIN users u ON f.user_id = u.id
        WHERE 1=1
      `;
      
      const queryParams = [];
      
      // Apply filters
      if (filters.department) {
        query += ' AND f.department = ?';
        queryParams.push(filters.department);
      }
      
      if (filters.designation) {
        query += ' AND f.designation = ?';
        queryParams.push(filters.designation);
      }
      
      if (filters.search) {
        query += ' AND (u.first_name LIKE ? OR u.last_name LIKE ? OR f.faculty_id LIKE ?)';
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
        FROM faculty f
        JOIN users u ON f.user_id = u.id
        WHERE 1=1
      `;
      
      const countParams = [];
      
      // Apply the same filters to count query
      if (filters.department) {
        countQuery += ' AND f.department = ?';
        countParams.push(filters.department);
      }
      
      if (filters.designation) {
        countQuery += ' AND f.designation = ?';
        countParams.push(filters.designation);
      }
      
      if (filters.search) {
        countQuery += ' AND (u.first_name LIKE ? OR u.last_name LIKE ? OR f.faculty_id LIKE ?)';
        const searchTerm = `%${filters.search}%`;
        countParams.push(searchTerm, searchTerm, searchTerm);
      }
      
      const [countResult] = await pool.execute(countQuery, countParams);
      const total = countResult[0].total;
      
      return {
        faculty: rows,
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
  
  // Update faculty
  static async updateFaculty(id, facultyData) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Get faculty to find user_id
      const [facultyRows] = await connection.execute(
        'SELECT user_id FROM faculty WHERE id = ?',
        [id]
      );
      
      if (!facultyRows.length) {
        throw new Error('Faculty not found');
      }
      
      const userId = facultyRows[0].user_id;
      
      // Update user data
      if (facultyData.firstName || facultyData.lastName || facultyData.email) {
        let userQuery = 'UPDATE users SET';
        const userParams = [];
        const userFields = [];
        
        if (facultyData.firstName) {
          userFields.push(' first_name = ?');
          userParams.push(facultyData.firstName);
        }
        
        if (facultyData.lastName) {
          userFields.push(' last_name = ?');
          userParams.push(facultyData.lastName);
        }
        
        if (facultyData.email) {
          userFields.push(' email = ?');
          userParams.push(facultyData.email);
        }
        
        userQuery += userFields.join(',') + ' WHERE id = ?';
        userParams.push(userId);
        
        await connection.execute(userQuery, userParams);
      }
      
      // Update faculty data
      if (facultyData.department || facultyData.designation) {
        let facultyQuery = 'UPDATE faculty SET';
        const facultyParams = [];
        const facultyFields = [];
        
        if (facultyData.department) {
          facultyFields.push(' department = ?');
          facultyParams.push(facultyData.department);
        }
        
        if (facultyData.designation) {
          facultyFields.push(' designation = ?');
          facultyParams.push(facultyData.designation);
        }
        
        facultyQuery += facultyFields.join(',') + ' WHERE id = ?';
        facultyParams.push(id);
        
        await connection.execute(facultyQuery, facultyParams);
      }
      
      await connection.commit();
      
      return this.getFacultyById(id);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  
  // Delete faculty
  static async deleteFaculty(id) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Get faculty to find user_id
      const [facultyRows] = await connection.execute(
        'SELECT user_id FROM faculty WHERE id = ?',
        [id]
      );
      
      if (!facultyRows.length) {
        throw new Error('Faculty not found');
      }
      
      const userId = facultyRows[0].user_id;
      
      // Delete faculty record
      await connection.execute('DELETE FROM faculty WHERE id = ?', [id]);
      
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
  
  // Get classes taught by faculty
  static async getFacultyClasses(facultyId) {
    try {
      const [rows] = await pool.execute(
        `SELECT cl.*, c.course_code, c.course_name, c.credits
         FROM classes cl
         JOIN courses c ON cl.course_id = c.id
         WHERE cl.faculty_id = ?
         ORDER BY cl.academic_year DESC, c.semester ASC`,
        [facultyId]
      );
      
      return rows;
    } catch (error) {
      throw error;
    }
  }
  
  // Mark class attendance
  static async markClassAttendance(facultyId, attendanceData) {
    const { classId, date, attendanceRecords } = attendanceData;
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Check if faculty is assigned to this class
      const [classRows] = await connection.execute(
        'SELECT id FROM classes WHERE id = ? AND faculty_id = ?',
        [classId, facultyId]
      );
      
      if (!classRows.length) {
        throw new Error('Faculty is not assigned to this class');
      }
      
      // Delete existing attendance records for this class and date (if any)
      await connection.execute(
        'DELETE FROM class_attendance WHERE class_id = ? AND date = ?',
        [classId, date]
      );
      
      // Insert new attendance records
      for (const record of attendanceRecords) {
        await connection.execute(
          'INSERT INTO class_attendance (class_id, student_id, date, status, marked_by) VALUES (?, ?, ?, ?, ?)',
          [classId, record.studentId, date, record.status, facultyId]
        );
      }
      
      await connection.commit();
      
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  
  // Mark exam attendance
  static async markExamAttendance(facultyId, attendanceData) {
    const { examId, attendanceRecords } = attendanceData;
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Check if exam exists
      const [examRows] = await connection.execute(
        `SELECT e.id, c.id as course_id
         FROM exams e
         JOIN courses c ON e.course_id = c.id
         JOIN classes cl ON c.id = cl.course_id
         WHERE e.id = ? AND cl.faculty_id = ?`,
        [examId, facultyId]
      );
      
      if (!examRows.length) {
        throw new Error('Faculty is not authorized to mark attendance for this exam');
      }
      
      // Delete existing attendance records for this exam (if any)
      await connection.execute(
        'DELETE FROM exam_attendance WHERE exam_id = ?',
        [examId]
      );
      
      // Insert new attendance records
      for (const record of attendanceRecords) {
        await connection.execute(
          'INSERT INTO exam_attendance (exam_id, student_id, status, marked_by) VALUES (?, ?, ?, ?)',
          [examId, record.studentId, record.status, facultyId]
        );
      }
      
      await connection.commit();
      
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  
  // Get pending leave requests
  static async getPendingLeaveRequests(facultyId, filters = {}) {
    try {
      let query = `
        SELECT lr.*, s.student_id as student_code, u.first_name, u.last_name
        FROM leave_requests lr
        JOIN students s ON lr.student_id = s.id
        JOIN users u ON s.user_id = u.id
        WHERE lr.status = 'pending'
      `;
      
      const queryParams = [];
      
      // Filter by department if faculty is department head
      if (filters.departmentOnly) {
        const [facultyRows] = await pool.execute(
          'SELECT department FROM faculty WHERE id = ?',
          [facultyId]
        );
        
        if (facultyRows.length) {
          query += ' AND s.department = ?';
          queryParams.push(facultyRows[0].department);
        }
      }
      
      // Add other filters
      if (filters.startDate) {
        query += ' AND lr.start_date >= ?';
        queryParams.push(filters.startDate);
      }
      
      if (filters.endDate) {
        query += ' AND lr.end_date <= ?';
        queryParams.push(filters.endDate);
      }
      
      query += ' ORDER BY lr.created_at ASC';
      
      const [rows] = await pool.execute(query, queryParams);
      
      return rows;
    } catch (error) {
      throw error;
    }
  }
  
  // Review leave request
  static async reviewLeaveRequest(facultyId, leaveRequestId, status) {
    try {
      const [result] = await pool.execute(
        'UPDATE leave_requests SET status = ?, reviewed_by = ? WHERE id = ?',
        [status, facultyId, leaveRequestId]
      );
      
      if (result.affectedRows === 0) {
        throw new Error('Leave request not found');
      }
      
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = FacultyModel; 
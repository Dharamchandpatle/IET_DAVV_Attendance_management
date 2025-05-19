const { pool } = require('../config/db');
const bcrypt = require('bcrypt');

class AdminModel {
  // Create a new admin
  static async createAdmin(userData) {
    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const [result] = await pool.execute(
        'INSERT INTO users (email, password, role, first_name, last_name) VALUES (?, ?, ?, ?, ?)',
        [userData.email, hashedPassword, 'admin', userData.firstName, userData.lastName]
      );
      
      return { id: result.insertId, email: userData.email, role: 'admin', firstName: userData.firstName, lastName: userData.lastName };
    } catch (error) {
      throw error;
    }
  }
  
  // Get attendance policy
  static async getAttendancePolicy() {
    try {
      const [rows] = await pool.execute('SELECT * FROM attendance_policies ORDER BY created_at DESC LIMIT 1');
      
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }
  
  // Update attendance policy
  static async updateAttendancePolicy(policyData, adminId) {
    try {
      const { minAttendancePercentage, lateCountAsAbsent } = policyData;
      
      const [result] = await pool.execute(
        'INSERT INTO attendance_policies (min_attendance_percentage, late_count_as_absent, created_by) VALUES (?, ?, ?)',
        [minAttendancePercentage, lateCountAsAbsent, adminId]
      );
      
      return { id: result.insertId, minAttendancePercentage, lateCountAsAbsent };
    } catch (error) {
      throw error;
    }
  }
  
  // Create a new course
  static async createCourse(courseData) {
    try {
      const { courseCode, courseName, department, semester, credits } = courseData;
      
      const [result] = await pool.execute(
        'INSERT INTO courses (course_code, course_name, department, semester, credits) VALUES (?, ?, ?, ?, ?)',
        [courseCode, courseName, department, semester, credits]
      );
      
      return { id: result.insertId, courseCode, courseName, department, semester, credits };
    } catch (error) {
      throw error;
    }
  }
  
  // Update a course
  static async updateCourse(courseId, courseData) {
    try {
      const { courseCode, courseName, department, semester, credits } = courseData;
      
      await pool.execute(
        'UPDATE courses SET course_code = ?, course_name = ?, department = ?, semester = ?, credits = ? WHERE id = ?',
        [courseCode, courseName, department, semester, credits, courseId]
      );
      
      const [rows] = await pool.execute('SELECT * FROM courses WHERE id = ?', [courseId]);
      
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }
  
  // Delete a course
  static async deleteCourse(courseId) {
    try {
      await pool.execute('DELETE FROM courses WHERE id = ?', [courseId]);
      return true;
    } catch (error) {
      throw error;
    }
  }
  
  // Create a new class
  static async createClass(classData) {
    try {
      const { courseId, facultyId, semester, section, academicYear } = classData;
      
      const [result] = await pool.execute(
        'INSERT INTO classes (course_id, faculty_id, semester, section, academic_year) VALUES (?, ?, ?, ?, ?)',
        [courseId, facultyId, semester, section, academicYear]
      );
      
      return { id: result.insertId, courseId, facultyId, semester, section, academicYear };
    } catch (error) {
      throw error;
    }
  }
  
  // Update a class
  static async updateClass(classId, classData) {
    try {
      const { courseId, facultyId, semester, section, academicYear } = classData;
      
      await pool.execute(
        'UPDATE classes SET course_id = ?, faculty_id = ?, semester = ?, section = ?, academic_year = ? WHERE id = ?',
        [courseId, facultyId, semester, section, academicYear, classId]
      );
      
      const [rows] = await pool.execute('SELECT * FROM classes WHERE id = ?', [classId]);
      
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }
  
  // Delete a class
  static async deleteClass(classId) {
    try {
      await pool.execute('DELETE FROM classes WHERE id = ?', [classId]);
      return true;
    } catch (error) {
      throw error;
    }
  }
  
  // Enroll students in a class
  static async enrollStudents(classId, studentIds) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Delete existing enrollments
      await connection.execute('DELETE FROM class_enrollments WHERE class_id = ?', [classId]);
      
      // Insert new enrollments
      for (const studentId of studentIds) {
        await connection.execute(
          'INSERT INTO class_enrollments (class_id, student_id) VALUES (?, ?)',
          [classId, studentId]
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
  
  // Create a new exam
  static async createExam(examData) {
    try {
      const { courseId, examName, examDate, startTime, endTime } = examData;
      
      const [result] = await pool.execute(
        'INSERT INTO exams (course_id, exam_name, exam_date, start_time, end_time) VALUES (?, ?, ?, ?, ?)',
        [courseId, examName, examDate, startTime, endTime]
      );
      
      return { id: result.insertId, courseId, examName, examDate, startTime, endTime };
    } catch (error) {
      throw error;
    }
  }
  
  // Update an exam
  static async updateExam(examId, examData) {
    try {
      const { courseId, examName, examDate, startTime, endTime } = examData;
      
      await pool.execute(
        'UPDATE exams SET course_id = ?, exam_name = ?, exam_date = ?, start_time = ?, end_time = ? WHERE id = ?',
        [courseId, examName, examDate, startTime, endTime, examId]
      );
      
      const [rows] = await pool.execute('SELECT * FROM exams WHERE id = ?', [examId]);
      
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }
  
  // Delete an exam
  static async deleteExam(examId) {
    try {
      await pool.execute('DELETE FROM exams WHERE id = ?', [examId]);
      return true;
    } catch (error) {
      throw error;
    }
  }
  
  // Create a holiday
  static async createHoliday(holidayData, adminId) {
    try {
      const { holidayName, holidayDate, description } = holidayData;
      
      const [result] = await pool.execute(
        'INSERT INTO holidays (holiday_name, holiday_date, description, created_by) VALUES (?, ?, ?, ?)',
        [holidayName, holidayDate, description, adminId]
      );
      
      return { id: result.insertId, holidayName, holidayDate, description };
    } catch (error) {
      throw error;
    }
  }
  
  // Update a holiday
  static async updateHoliday(holidayId, holidayData) {
    try {
      const { holidayName, holidayDate, description } = holidayData;
      
      await pool.execute(
        'UPDATE holidays SET holiday_name = ?, holiday_date = ?, description = ? WHERE id = ?',
        [holidayName, holidayDate, description, holidayId]
      );
      
      const [rows] = await pool.execute('SELECT * FROM holidays WHERE id = ?', [holidayId]);
      
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }
  
  // Delete a holiday
  static async deleteHoliday(holidayId) {
    try {
      await pool.execute('DELETE FROM holidays WHERE id = ?', [holidayId]);
      return true;
    } catch (error) {
      throw error;
    }
  }
  
  // Get all holidays
  static async getAllHolidays() {
    try {
      const [rows] = await pool.execute('SELECT * FROM holidays ORDER BY holiday_date');
      return rows;
    } catch (error) {
      throw error;
    }
  }
  
  // Generate attendance report
  static async generateAttendanceReport(filters = {}) {
    try {
      let query = `
        SELECT 
          s.id as student_id, 
          s.student_id as student_code, 
          u.first_name, 
          u.last_name, 
          c.course_code, 
          c.course_name,
          COUNT(ca.id) as total_classes,
          SUM(CASE WHEN ca.status = 'present' THEN 1 ELSE 0 END) as present_count,
          SUM(CASE WHEN ca.status = 'absent' THEN 1 ELSE 0 END) as absent_count,
          SUM(CASE WHEN ca.status = 'late' THEN 1 ELSE 0 END) as late_count,
          ROUND((SUM(CASE WHEN ca.status = 'present' THEN 1 ELSE 0 END) / COUNT(ca.id)) * 100, 2) as attendance_percentage
        FROM 
          students s
          JOIN users u ON s.user_id = u.id
          JOIN class_enrollments ce ON s.id = ce.student_id
          JOIN classes cl ON ce.class_id = cl.id
          JOIN courses c ON cl.course_id = c.id
          LEFT JOIN class_attendance ca ON s.id = ca.student_id AND cl.id = ca.class_id
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
      
      query += ' GROUP BY s.id, c.id';
      
      if (filters.belowThreshold) {
        const policy = await this.getAttendancePolicy();
        const threshold = policy ? policy.min_attendance_percentage : 75;
        query += ` HAVING attendance_percentage < ${threshold}`;
      }
      
      query += ' ORDER BY c.course_code, attendance_percentage ASC';
      
      const [rows] = await pool.execute(query, queryParams);
      
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AdminModel; 
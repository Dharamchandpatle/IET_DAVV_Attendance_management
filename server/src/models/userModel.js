const { pool } = require('../config/db');
const bcrypt = require('bcrypt');

class UserModel {
  // Create a new user
  static async createUser(userData) {
    try {
      const { email, password, role, firstName, lastName } = userData;
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Insert user
      const [result] = await pool.execute(
        'INSERT INTO users (email, password, role, first_name, last_name) VALUES (?, ?, ?, ?, ?)',
        [email, hashedPassword, role, firstName, lastName]
      );
      
      return {
        id: result.insertId,
        email,
        role,
        firstName,
        lastName
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  
  // Find user by email
  static async findByEmail(email) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }
  
  // Find user by ID
  static async findById(id, includePassword = false) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      
      if (!rows.length) return null;
      
      const user = rows[0];
      
      if (!includePassword) {
        delete user.password;
      }
      
      return user;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }
  
  // Update user
  static async updateUser(id, userData) {
    const { firstName, lastName, email } = userData;
    
    try {
      await pool.execute(
        'UPDATE users SET first_name = ?, last_name = ?, email = ? WHERE id = ?',
        [firstName, lastName, email, id]
      );
      
      return this.findById(id);
    } catch (error) {
      throw error;
    }
  }
  
  // Change password
  static async changePassword(id, newPassword) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      await pool.execute(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, id]
      );
      
      return true;
    } catch (error) {
      throw error;
    }
  }
  
  // Delete user
  static async deleteUser(id) {
    try {
      await pool.execute('DELETE FROM users WHERE id = ?', [id]);
      return true;
    } catch (error) {
      throw error;
    }
  }
  
  // Get all users with pagination
  static async getAllUsers(page = 1, limit = 10, role = null) {
    try {
      let query = 'SELECT id, email, role, first_name, last_name, created_at FROM users';
      const params = [];
      
      if (role) {
        query += ' WHERE role = ?';
        params.push(role);
      }
      
      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      const offset = (page - 1) * limit;
      params.push(limit, offset);
      
      const [rows] = await pool.execute(query, params);
      
      // Get total count for pagination
      let countQuery = 'SELECT COUNT(*) as total FROM users';
      if (role) {
        countQuery += ' WHERE role = ?';
      }
      
      const [countResult] = await pool.execute(countQuery, role ? [role] : []);
      const total = countResult[0].total;
      
      return {
        users: rows,
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

  static async updatePassword(userId, hashedPassword) {
    try {
      await pool.execute(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, userId]
      );
      
      return true;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  }
}

module.exports = UserModel; 
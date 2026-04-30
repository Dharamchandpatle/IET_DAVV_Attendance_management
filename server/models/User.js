const { query } = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  // Create a new user
  static async createUser(name, email, password, role, phone = null, profile_image = null) {
    // Validate email domain
    if (!email.endsWith('@ietdavv.edu.in')) {
      throw new Error('Email must end with @ietdavv.edu.in');
    }

    // Validate role
    const validRoles = ['student', 'faculty', 'admin'];
    if (!validRoles.includes(role)) {
      throw new Error('Invalid role. Must be student, faculty, or admin');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      return await query(
        'INSERT INTO users (name, email, password, role, phone, profile_image, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, email, hashedPassword, role, phone, profile_image, true]
      );
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Email already exists');
      }
      throw error;
    }
  }

  // Find user by email (for login or forgot password)
  static async findUserByEmail(email) {
    const rows = await query(
      'SELECT id, name, email, password, role, phone, profile_image, created_at, updated_at, last_login, is_active FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  // Find user by ID (for profile or admin access)
  static async findUserById(id) {
    const rows = await query(
      'SELECT id, name, email, role, phone, profile_image, created_at, updated_at, last_login, is_active FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  // Get all users (admin only)
  static async getAllUsers() {
    return query(
      'SELECT id, name, email, role, phone, profile_image, created_at, updated_at, last_login, is_active FROM users'
    );
  }

  // Update user profile
  static async updateUser(id, name, email, phone = null, profile_image = null, is_active = true) {
    if (!email.endsWith('@ietdavv.edu.in')) {
      throw new Error('Email must end with @ietdavv.edu.in');
    }

    try {
      return await query(
        'UPDATE users SET name = ?, email = ?, phone = ?, profile_image = ?, is_active = ? WHERE id = ?',
        [name, email, phone, profile_image, is_active, id]
      );
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Email already exists');
      }
      throw error;
    }
  }

  // Update user role (admin only)
  static async updateUserRole(id, role) {
    const validRoles = ['student', 'faculty', 'admin'];
    if (!validRoles.includes(role)) {
      throw new Error('Invalid role. Must be student, faculty, or admin');
    }

    return query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
  }

  // Update last login timestamp
  static async updateLastLogin(id) {
    return query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [id]);
  }

  // Delete user (admin only)
  static async deleteUser(id) {
    try {
      return await query('DELETE FROM users WHERE id = ?', [id]);
    } catch (error) {
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        throw new Error('Cannot delete user: referenced in other tables (e.g., students, faculty)');
      }
      throw error;
    }
  }
}

module.exports = User;
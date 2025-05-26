const db = require('../config/db');
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
    return new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO users (name, email, password, role, phone, profile_image, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, email, hashedPassword, role, phone, profile_image, true],
        (err, result) => {
          if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
              reject(new Error('Email already exists'));
            }
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  }

  // Find user by email (for login or forgot password)
  static async findUserByEmail(email) {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT id, name, email, password, role, phone, profile_image, created_at, updated_at, last_login, is_active FROM users WHERE email = ?',
        [email],
        (err, result) => {
          if (err) reject(err);
          else resolve(result[0]);
        }
      );
    });
  }

  // Find user by ID (for profile or admin access)
  static async findUserById(id) {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT id, name, email, role, phone, profile_image, created_at, updated_at, last_login, is_active FROM users WHERE id = ?',
        [id],
        (err, result) => {
          if (err) reject(err);
          else resolve(result[0]);
        }
      );
    });
  }

  // Get all users (admin only)
  static async getAllUsers() {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT id, name, email, role, phone, profile_image, created_at, updated_at, last_login, is_active FROM users',
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  }

  // Update user profile
  static async updateUser(id, name, email, phone = null, profile_image = null, is_active = true) {
    if (!email.endsWith('@ietdavv.edu.in')) {
      throw new Error('Email must end with @ietdavv.edu.in');
    }

    return new Promise((resolve, reject) => {
      db.query(
        'UPDATE users SET name = ?, email = ?, phone = ?, profile_image = ?, is_active = ? WHERE id = ?',
        [name, email, phone, profile_image, is_active, id],
        (err, result) => {
          if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
              reject(new Error('Email already exists'));
            }
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  }

  // Update user role (admin only)
  static async updateUserRole(id, role) {
    const validRoles = ['student', 'faculty', 'admin'];
    if (!validRoles.includes(role)) {
      throw new Error('Invalid role. Must be student, faculty, or admin');
    }

    return new Promise((resolve, reject) => {
      db.query(
        'UPDATE users SET role = ? WHERE id = ?',
        [role, id],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  }

  // Update last login timestamp
  static async updateLastLogin(id) {
    return new Promise((resolve, reject) => {
      db.query(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
        [id],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  }

  // Delete user (admin only)
  static async deleteUser(id) {
    return new Promise((resolve, reject) => {
      db.query(
        'DELETE FROM users WHERE id = ?',
        [id],
        (err, result) => {
          if (err) {
            if (err.code === 'ER_ROW_IS_REFERENCED_2') {
              reject(new Error('Cannot delete user: referenced in other tables (e.g., students, faculty)'));
            }
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  }
}

module.exports = User;
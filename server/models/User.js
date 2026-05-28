const { query } = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  // Create a new user and return the inserted id
  static async create({ name, email, password, role = 'student', phone = null }) {
    if (!email || !email.endsWith('@ietdavv.edu.in')) {
      const err = new Error('Email must be a valid @ietdavv.edu.in address');
      err.status = 400;
      throw err;
    }

    const validRoles = ['student', 'faculty', 'admin'];
    if (!validRoles.includes(role)) {
      const err = new Error('Invalid role');
      err.status = 400;
      throw err;
    }

    const hashed = await bcrypt.hash(password, 10);
    try {
      const result = await query(
        'INSERT INTO users (name, email, password, role, phone, is_active) VALUES (?, ?, ?, ?, ?, ?)',
        [name, email, hashed, role, phone, true]
      );
      return { insertId: result.insertId };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        const err = new Error('Email already exists');
        err.status = 409;
        throw err;
      }
      throw error;
    }
  }

  static async findByEmail(email) {
    const rows = await query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  }

  static async findById(id) {
    const rows = await query('SELECT id, name, email, role, phone, created_at, updated_at, last_login, is_active FROM users WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async updateLastLogin(id) {
    return query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [id]);
  }

  static async getAllUsers() {
    return query('SELECT id, name, email, role, phone, created_at, updated_at, last_login, is_active FROM users');
  }

  static async updateUser(id, name, email, phone = null, is_active = true) {
    if (!email || !email.endsWith('@ietdavv.edu.in')) {
      const err = new Error('Email must be a valid @ietdavv.edu.in address');
      err.status = 400;
      throw err;
    }

    try {
      return await query('UPDATE users SET name = ?, email = ?, phone = ?, is_active = ? WHERE id = ?', [name, email, phone, is_active, id]);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        const err = new Error('Email already exists');
        err.status = 409;
        throw err;
      }
      throw error;
    }
  }

  static async updateUserRole(id, role) {
    const validRoles = ['student', 'faculty', 'admin'];
    if (!validRoles.includes(role)) {
      const err = new Error('Invalid role');
      err.status = 400;
      throw err;
    }
    return query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
  }

  static async deleteUser(id) {
    try {
      return await query('DELETE FROM users WHERE id = ?', [id]);
    } catch (error) {
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        const err = new Error('Cannot delete user: referenced in other tables');
        err.status = 400;
        throw err;
      }
      throw error;
    }
  }
}

module.exports = User;
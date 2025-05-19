const { pool } = require('../config/db');

class User {
  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async create({ email, password, role, firstName, lastName }) {
    const [result] = await pool.execute(
      'INSERT INTO users (email, password, role, first_name, last_name) VALUES (?, ?, ?, ?, ?)',
      [email, password, role, firstName, lastName]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async updatePassword(id, password) {
    await pool.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [password, id]
    );
  }

  static async updateResetToken(email, token, expires) {
    await pool.execute(
      'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?',
      [token, expires, email]
    );
  }
}

module.exports = User;
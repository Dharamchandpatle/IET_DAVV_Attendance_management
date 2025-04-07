const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create({ name, email, password, role, department }) {
    const hashedPassword = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT_ROUNDS));
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, role, department) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, role, department]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  static async updateProfile(id, updates) {
    const allowedUpdates = ['name', 'email', 'department'];
    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {});

    if (Object.keys(filteredUpdates).length === 0) return false;

    const setClauses = Object.keys(filteredUpdates)
      .map(key => `${key} = ?`)
      .join(', ');
    const values = [...Object.values(filteredUpdates), id];

    const [result] = await pool.execute(
      `UPDATE users SET ${setClauses} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  }

  static async changePassword(id, oldPassword, newPassword) {
    const user = await this.findById(id);
    if (!user) throw new Error('User not found');

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new Error('Current password is incorrect');

    const hashedPassword = await bcrypt.hash(newPassword, Number(process.env.BCRYPT_SALT_ROUNDS));
    const [result] = await pool.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, id]
    );
    return result.affectedRows > 0;
  }

  static async validatePassword(user, password) {
    return bcrypt.compare(password, user.password);
  }
}

module.exports = User;
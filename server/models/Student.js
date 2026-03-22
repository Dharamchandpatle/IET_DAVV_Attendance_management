const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Small promise wrapper for MySQL callbacks.
const query = (sql, params = []) =>
	new Promise((resolve, reject) => {
		db.query(sql, params, (err, result) => {
			if (err) return reject(err);
			return resolve(result);
		});
	});

// Run multiple queries as a single transaction.
const withTransaction = (work) =>
	new Promise((resolve, reject) => {
		db.beginTransaction(async (err) => {
			if (err) return reject(err);
			try {
				const result = await work();
				db.commit((commitErr) => {
					if (commitErr) {
						return db.rollback(() => reject(commitErr));
					}
					return resolve(result);
				});
			} catch (error) {
				db.rollback(() => reject(error));
			}
		});
	});

class Student {
	// Creates both user + student rows in one transaction.
	static async createWithUser(payload) {
		const {
			name,
			email,
			password,
			phone = null,
			profile_image = null,
			roll_number,
			department_id,
			semester,
			section,
			admission_year,
			cgpa = null,
			address = null,
			guardian_name = null,
			guardian_phone = null
		} = payload;

		if (!email.endsWith('@ietdavv.edu.in')) {
			throw new Error('Email must end with @ietdavv.edu.in');
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		return withTransaction(async () => {
			const userResult = await query(
				'INSERT INTO users (name, email, password, role, phone, profile_image, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
				[name, email, hashedPassword, 'student', phone, profile_image, true]
			);

			const userId = userResult.insertId;
			const studentResult = await query(
				'INSERT INTO students (user_id, roll_number, department_id, semester, section, admission_year, cgpa, address, guardian_name, guardian_phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
				[
					userId,
					roll_number,
					department_id,
					semester,
					section,
					admission_year,
					cgpa,
					address,
					guardian_name,
					guardian_phone
				]
			);

			return { userId, studentId: studentResult.insertId };
		});
	}

	// Returns students with user + department info.
	static async findAll() {
		return query(
			`SELECT s.*, u.name, u.email, u.phone, u.profile_image, u.is_active, u.created_at, u.updated_at, u.last_login,
							d.name AS department_name, d.code AS department_code
			 FROM students s
			 JOIN users u ON s.user_id = u.id
			 LEFT JOIN departments d ON s.department_id = d.id
			 ORDER BY s.id DESC`
		);
	}

	// Fetches a student by student id.
	static async findById(id) {
		const rows = await query(
			`SELECT s.*, u.name, u.email, u.phone, u.profile_image, u.is_active, u.created_at, u.updated_at, u.last_login,
							d.name AS department_name, d.code AS department_code
			 FROM students s
			 JOIN users u ON s.user_id = u.id
			 LEFT JOIN departments d ON s.department_id = d.id
			 WHERE s.id = ?`,
			[id]
		);
		return rows[0];
	}

	// Fetches a student by user id.
	static async findByUserId(userId) {
		const rows = await query(
			`SELECT s.*, u.name, u.email, u.phone, u.profile_image, u.is_active, u.created_at, u.updated_at, u.last_login,
							d.name AS department_name, d.code AS department_code
			 FROM students s
			 JOIN users u ON s.user_id = u.id
			 LEFT JOIN departments d ON s.department_id = d.id
			 WHERE u.id = ?`,
			[userId]
		);
		return rows[0];
	}

	// Updates user + student columns together when provided.
	static async updateById(id, userUpdates = {}, studentUpdates = {}) {
		return withTransaction(async () => {
			const current = await Student.findById(id);
			if (!current) return null;

			const userFields = [];
			const userValues = [];
			if (userUpdates.name !== undefined) {
				userFields.push('name = ?');
				userValues.push(userUpdates.name);
			}
			if (userUpdates.email !== undefined) {
				if (!userUpdates.email.endsWith('@ietdavv.edu.in')) {
					throw new Error('Email must end with @ietdavv.edu.in');
				}
				userFields.push('email = ?');
				userValues.push(userUpdates.email);
			}
			if (userUpdates.phone !== undefined) {
				userFields.push('phone = ?');
				userValues.push(userUpdates.phone);
			}
			if (userUpdates.profile_image !== undefined) {
				userFields.push('profile_image = ?');
				userValues.push(userUpdates.profile_image);
			}
			if (userUpdates.is_active !== undefined) {
				userFields.push('is_active = ?');
				userValues.push(userUpdates.is_active);
			}

			if (userFields.length) {
				await query(
					`UPDATE users SET ${userFields.join(', ')} WHERE id = ?`,
					[...userValues, current.user_id]
				);
			}

			const studentFields = [];
			const studentValues = [];
			const mapField = (key, column) => {
				if (studentUpdates[key] !== undefined) {
					studentFields.push(`${column} = ?`);
					studentValues.push(studentUpdates[key]);
				}
			};

			mapField('roll_number', 'roll_number');
			mapField('department_id', 'department_id');
			mapField('semester', 'semester');
			mapField('section', 'section');
			mapField('admission_year', 'admission_year');
			mapField('cgpa', 'cgpa');
			mapField('address', 'address');
			mapField('guardian_name', 'guardian_name');
			mapField('guardian_phone', 'guardian_phone');

			if (studentFields.length) {
				await query(
					`UPDATE students SET ${studentFields.join(', ')} WHERE id = ?`,
					[...studentValues, id]
				);
			}

			return Student.findById(id);
		});
	}

	// Deletes student via user row to keep FK cleanup consistent.
	static async deleteById(id) {
		return withTransaction(async () => {
			const current = await Student.findById(id);
			if (!current) return null;
			await query('DELETE FROM users WHERE id = ?', [current.user_id]);
			return true;
		});
	}
}

module.exports = Student;

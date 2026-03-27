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

class Faculty {
	// Creates both user + faculty rows in one transaction.
	static async createWithUser(payload) {
		const {
			name,
			email,
			password,
			phone = null,
			profile_image = null,
			faculty_code,
			department_id,
			designation,
			specialization = null,
			joining_date,
			education_details = null,
			address = null
		} = payload;

		if (!email.endsWith('@ietdavv.edu.in')) {
			throw new Error('Email must end with @ietdavv.edu.in');
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		return withTransaction(async () => {
			const userResult = await query(
				'INSERT INTO users (name, email, password, role, phone, profile_image, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
				[name, email, hashedPassword, 'faculty', phone, profile_image, true]
			);

			const userId = userResult.insertId;
			const facultyResult = await query(
				'INSERT INTO faculty (user_id, faculty_code, department_id, designation, specialization, joining_date, education_details, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
				[
					userId,
					faculty_code,
					department_id,
					designation,
					specialization,
					joining_date,
					education_details,
					address
				]
			);

			return { userId, facultyId: facultyResult.insertId };
		});
	}

	// Returns faculty with user + department info.
	static async findAll() {
		return query(
			`SELECT f.*, u.name, u.email, u.phone, u.profile_image, u.is_active, u.created_at, u.updated_at, u.last_login,
					d.name AS department_name, d.code AS department_code
			 FROM faculty f
			 JOIN users u ON f.user_id = u.id
			 LEFT JOIN departments d ON f.department_id = d.id
			 ORDER BY f.id DESC`
		);
	}

	// Fetches a faculty member by faculty id.
	static async findById(id) {
		const rows = await query(
			`SELECT f.*, u.name, u.email, u.phone, u.profile_image, u.is_active, u.created_at, u.updated_at, u.last_login,
					d.name AS department_name, d.code AS department_code
			 FROM faculty f
			 JOIN users u ON f.user_id = u.id
			 LEFT JOIN departments d ON f.department_id = d.id
			 WHERE f.id = ?`,
			[id]
		);
		return rows[0];
	}

	// Fetches a faculty member by user id.
	static async findByUserId(userId) {
		const rows = await query(
			`SELECT f.*, u.name, u.email, u.phone, u.profile_image, u.is_active, u.created_at, u.updated_at, u.last_login,
					d.name AS department_name, d.code AS department_code
			 FROM faculty f
			 JOIN users u ON f.user_id = u.id
			 LEFT JOIN departments d ON f.department_id = d.id
			 WHERE u.id = ?`,
			[userId]
		);
		return rows[0];
	}

	// Updates user + faculty columns together when provided.
	static async updateById(id, userUpdates = {}, facultyUpdates = {}) {
		return withTransaction(async () => {
			const current = await Faculty.findById(id);
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

			const facultyFields = [];
			const facultyValues = [];
			const mapField = (key, column) => {
				if (facultyUpdates[key] !== undefined) {
					facultyFields.push(`${column} = ?`);
					facultyValues.push(facultyUpdates[key]);
				}
			};

			mapField('faculty_code', 'faculty_code');
			mapField('department_id', 'department_id');
			mapField('designation', 'designation');
			mapField('specialization', 'specialization');
			mapField('joining_date', 'joining_date');
			mapField('education_details', 'education_details');
			mapField('address', 'address');

			if (facultyFields.length) {
				await query(
					`UPDATE faculty SET ${facultyFields.join(', ')} WHERE id = ?`,
					[...facultyValues, id]
				);
			}

			return Faculty.findById(id);
		});
	}

	// Deletes faculty via user row to keep FK cleanup consistent.
	static async deleteById(id) {
		return withTransaction(async () => {
			const current = await Faculty.findById(id);
			if (!current) return null;
			await query('DELETE FROM users WHERE id = ?', [current.user_id]);
			return true;
		});
	}
}

module.exports = Faculty;

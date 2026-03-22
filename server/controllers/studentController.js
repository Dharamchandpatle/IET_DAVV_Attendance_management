const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
const User = require('../models/User');
const { generateToken } = require('../utils/jwtUtils');

class StudentController {
	// Student registration with profile creation.
	static async register(req, res) {
		try {
			const {
				name,
				email,
				password,
				phone,
				profile_image,
				roll_number,
				department_id,
				semester,
				section,
				admission_year,
				cgpa,
				address,
				guardian_name,
				guardian_phone
			} = req.body;

			if (!name || !email || !password) {
				return res.status(400).json({ message: 'Name, email, and password are required' });
			}
			if (!roll_number || !department_id || !semester || !section || !admission_year) {
				return res.status(400).json({ message: 'Student profile fields are required' });
			}
			if (password.length < 8) {
				return res.status(400).json({ message: 'Password must be at least 8 characters long' });
			}

			const result = await Student.createWithUser({
				name,
				email,
				password,
				phone,
				profile_image,
				roll_number,
				department_id,
				semester,
				section,
				admission_year,
				cgpa,
				address,
				guardian_name,
				guardian_phone
			});

			const token = generateToken({ id: result.userId, role: 'student' });
			return res.status(201).json({
				userId: result.userId,
				studentId: result.studentId,
				token,
				message: 'Student registered successfully'
			});
		} catch (error) {
			if (error.message === 'Email already exists') {
				return res.status(409).json({ message: error.message });
			}
			if (error.message.includes('Email must end with')) {
				return res.status(400).json({ message: error.message });
			}
			if (error.code === 'ER_DUP_ENTRY') {
				return res.status(409).json({ message: 'Duplicate student record' });
			}
			return res.status(500).json({ message: 'Error registering student', error: error.message });
		}
	}

	// Student login only (role-checked).
	static async login(req, res) {
		try {
			const { email, password } = req.body;
			if (!email || !password) {
				return res.status(400).json({ message: 'Email and password are required' });
			}
			const user = await User.findUserByEmail(email);
			if (!user || user.role !== 'student') {
				return res.status(401).json({ message: 'Invalid email or password' });
			}
			const isPasswordValid = await bcrypt.compare(password, user.password);
			if (!isPasswordValid) {
				return res.status(401).json({ message: 'Invalid email or password' });
			}
			await User.updateLastLogin(user.id);
			const student = await Student.findByUserId(user.id);
			const token = generateToken({ id: user.id, role: user.role });
			return res.json({
				token,
				user: { id: user.id, name: user.name, email: user.email, role: user.role },
				student,
				message: 'Login successful'
			});
		} catch (error) {
			return res.status(500).json({ message: 'Error logging in', error: error.message });
		}
	}

	// Admin/faculty list of students.
	static async getAll(req, res) {
		try {
			const students = await Student.findAll();
			return res.json(students);
		} catch (error) {
			return res.status(500).json({ message: 'Error fetching students', error: error.message });
		}
	}

	// Students can only view their own record.
	static async getById(req, res) {
		try {
			const { id } = req.params;
			const student = await Student.findById(id);
			if (!student) {
				return res.status(404).json({ message: 'Student not found' });
			}

			if (req.user?.role === 'student' && student.user_id !== req.user.id) {
				return res.status(403).json({ message: 'Forbidden' });
			}

			return res.json(student);
		} catch (error) {
			return res.status(500).json({ message: 'Error fetching student', error: error.message });
		}
	}

	// Students can only update their own record.
	static async update(req, res) {
		try {
			const { id } = req.params;
			const current = await Student.findById(id);
			if (!current) {
				return res.status(404).json({ message: 'Student not found' });
			}

			if (req.user?.role === 'student' && current.user_id !== req.user.id) {
				return res.status(403).json({ message: 'Forbidden' });
			}

			const userUpdates = {
				name: req.body.name,
				email: req.body.email,
				phone: req.body.phone,
				profile_image: req.body.profile_image,
				is_active: req.body.is_active
			};

			const studentUpdates = {
				roll_number: req.body.roll_number,
				department_id: req.body.department_id,
				semester: req.body.semester,
				section: req.body.section,
				admission_year: req.body.admission_year,
				cgpa: req.body.cgpa,
				address: req.body.address,
				guardian_name: req.body.guardian_name,
				guardian_phone: req.body.guardian_phone
			};

			const updated = await Student.updateById(id, userUpdates, studentUpdates);
			return res.json({ message: 'Student updated successfully', student: updated });
		} catch (error) {
			if (error.message?.includes('Email must end with')) {
				return res.status(400).json({ message: error.message });
			}
			if (error.code === 'ER_DUP_ENTRY') {
				return res.status(409).json({ message: 'Duplicate student record' });
			}
			return res.status(500).json({ message: 'Error updating student', error: error.message });
		}
	}

	// Admin-only delete.
	static async remove(req, res) {
		try {
			const { id } = req.params;
			const removed = await Student.deleteById(id);
			if (!removed) {
				return res.status(404).json({ message: 'Student not found' });
			}
			return res.json({ message: 'Student deleted successfully' });
		} catch (error) {
			return res.status(500).json({ message: 'Error deleting student', error: error.message });
		}
	}
}

module.exports = StudentController;

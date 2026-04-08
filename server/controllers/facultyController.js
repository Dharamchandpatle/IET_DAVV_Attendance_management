const bcrypt = require('bcryptjs');
const Faculty = require('../models/Faculty');
const User = require('../models/User');
const { generateToken } = require('../utils/jwtUtils');

// FacultyController handles faculty auth and profile CRUD.
class FacultyController {
	// Faculty registration with profile creation.
	static async register(req, res) {
		try {
			const {
				name,
				email,
				password,
				phone,
				profile_image,
				faculty_code,
				department_id,
				designation,
				specialization,
				joining_date,
				education_details,
				address
			} = req.body;

			if (!name || !email || !password) {
				return res.status(400).json({ message: 'Name, email, and password are required' });
			}
			if (!faculty_code || !department_id || !designation || !joining_date) {
				return res.status(400).json({ message: 'Faculty profile fields are required' });
			}
			if (password.length < 8) {
				return res.status(400).json({ message: 'Password must be at least 8 characters long' });
			}

			const result = await Faculty.createWithUser({
				name,
				email,
				password,
				phone,
				profile_image,
				faculty_code,
				department_id,
				designation,
				specialization,
				joining_date,
				education_details,
				address
			});

			const token = generateToken({ id: result.userId, role: 'faculty' });
			return res.status(201).json({
				userId: result.userId,
				facultyId: result.facultyId,
				token,
				message: 'Faculty registered successfully'
			});
		} catch (error) {
			if (error.message === 'Email already exists') {
				return res.status(409).json({ message: error.message });
			}
			if (error.message.includes('Email must end with')) {
				return res.status(400).json({ message: error.message });
			}
			if (error.code === 'ER_DUP_ENTRY') {
				return res.status(409).json({ message: 'Duplicate faculty record' });
			}
			return res.status(500).json({ message: 'Error registering faculty', error: error.message });
		}
	}

	// Faculty login only (role-checked).
	static async login(req, res) {
		try {
			const { email, password } = req.body;
			if (!email || !password) {
				return res.status(400).json({ message: 'Email and password are required' });
			}
			const user = await User.findUserByEmail(email);
			if (!user || user.role !== 'faculty') {
				return res.status(401).json({ message: 'Invalid email or password' });
			}
			const isPasswordValid = await bcrypt.compare(password, user.password);
			if (!isPasswordValid) {
				return res.status(401).json({ message: 'Invalid email or password' });
			}
			await User.updateLastLogin(user.id);
			const faculty = await Faculty.findByUserId(user.id);
			const token = generateToken({ id: user.id, role: user.role });
			return res.json({
				token,
				user: { id: user.id, name: user.name, email: user.email, role: user.role },
				faculty,
				message: 'Login successful'
			});
		} catch (error) {
			return res.status(500).json({ message: 'Error logging in', error: error.message });
		}
	}

	// Admin list of faculty.
	static async getAll(req, res) {
		try {
			const faculty = await Faculty.findAll();
			return res.json(faculty);
		} catch (error) {
			return res.status(500).json({ message: 'Error fetching faculty', error: error.message });
		}
	}

	// Faculty can only view their own record.
	static async getById(req, res) {
		try {
			const { id } = req.params;
			const faculty = await Faculty.findById(id);
			if (!faculty) {
				return res.status(404).json({ message: 'Faculty not found' });
			}

			if (req.user?.role === 'faculty' && faculty.user_id !== req.user.id) {
				return res.status(403).json({ message: 'Forbidden' });
			}

			return res.json(faculty);
		} catch (error) {
			return res.status(500).json({ message: 'Error fetching faculty', error: error.message });
		}
	}

	// Faculty can only update their own record.
	static async update(req, res) {
		try {
			const { id } = req.params;
			const current = await Faculty.findById(id);
			if (!current) {
				return res.status(404).json({ message: 'Faculty not found' });
			}

			if (req.user?.role === 'faculty' && current.user_id !== req.user.id) {
				return res.status(403).json({ message: 'Forbidden' });
			}

			const userUpdates = {
				name: req.body.name,
				email: req.body.email,
				phone: req.body.phone,
				profile_image: req.body.profile_image,
				is_active: req.body.is_active
			};

			const facultyUpdates = {
				faculty_code: req.body.faculty_code,
				department_id: req.body.department_id,
				designation: req.body.designation,
				specialization: req.body.specialization,
				joining_date: req.body.joining_date,
				education_details: req.body.education_details,
				address: req.body.address
			};

			const updated = await Faculty.updateById(id, userUpdates, facultyUpdates);
			return res.json({ message: 'Faculty updated successfully', faculty: updated });
		} catch (error) {
			if (error.message?.includes('Email must end with')) {
				return res.status(400).json({ message: error.message });
			}
			if (error.code === 'ER_DUP_ENTRY') {
				return res.status(409).json({ message: 'Duplicate faculty record' });
			}
			return res.status(500).json({ message: 'Error updating faculty', error: error.message });
		}
	}

	// Admin-only delete.
	static async remove(req, res) {
		try {
			const { id } = req.params;
			const removed = await Faculty.deleteById(id);
			if (!removed) {
				return res.status(404).json({ message: 'Faculty not found' });
			}
			return res.json({ message: 'Faculty deleted successfully' });
		} catch (error) {
			return res.status(500).json({ message: 'Error deleting faculty', error: error.message });
		}
	}
}

module.exports = FacultyController;

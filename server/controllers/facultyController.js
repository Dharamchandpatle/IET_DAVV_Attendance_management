const facultyService = require('../services/facultyService');
const { sendSuccess, sendError } = require('../utils/response');

// FacultyController handles faculty auth and profile CRUD.
class FacultyController {
	// Faculty registration with profile creation.
	static async register(req, res) {
		try {
			const data = await facultyService.registerFaculty(req.body);
			return sendSuccess(res, 'Faculty registered successfully', data, 201);
		} catch (error) {
			const status = error.status || (error.code === 'ER_DUP_ENTRY' ? 409 : 500);
			return sendError(res, error.message || 'Error registering faculty', status);
		}
	}

	// Faculty login only (role-checked).
	static async login(req, res) {
		try {
			const data = await facultyService.loginFaculty(req.body);
			return sendSuccess(res, 'Login successful', data);
		} catch (error) {
			const status = error.status || 500;
			return sendError(res, error.message || 'Error logging in', status);
		}
	}

	// Admin list of faculty.
	static async getAll(req, res) {
		try {
			const faculty = await facultyService.getAllFaculty();
			return sendSuccess(res, 'Faculty fetched successfully', faculty);
		} catch (error) {
			const status = error.status || 500;
			return sendError(res, error.message || 'Error fetching faculty', status);
		}
	}

	// Faculty can only view their own record.
	static async getById(req, res) {
		try {
			const { id } = req.params;
			const faculty = await facultyService.getFacultyById(id);
			if (!faculty) {
				return sendError(res, 'Faculty not found', 404);
			}

			if (req.user?.role === 'faculty' && faculty.user_id !== req.user.id) {
				return sendError(res, 'Forbidden', 403);
			}

			return sendSuccess(res, 'Faculty fetched successfully', faculty);
		} catch (error) {
			const status = error.status || 500;
			return sendError(res, error.message || 'Error fetching faculty', status);
		}
	}

	// Faculty can only update their own record.
	static async update(req, res) {
		try {
			const { id } = req.params;
			const current = await facultyService.getFacultyById(id);
			if (!current) {
				return sendError(res, 'Faculty not found', 404);
			}

			if (req.user?.role === 'faculty' && current.user_id !== req.user.id) {
				return sendError(res, 'Forbidden', 403);
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

			const updated = await facultyService.updateFaculty(id, userUpdates, facultyUpdates);
			return sendSuccess(res, 'Faculty updated successfully', updated);
		} catch (error) {
			const status = error.status || (error.code === 'ER_DUP_ENTRY' ? 409 : 500);
			return sendError(res, error.message || 'Error updating faculty', status);
		}
	}

	// Admin-only delete.
	static async remove(req, res) {
		try {
			const { id } = req.params;
			const removed = await facultyService.deleteFaculty(id);
			if (!removed) {
				return sendError(res, 'Faculty not found', 404);
			}
			return sendSuccess(res, 'Faculty deleted successfully');
		} catch (error) {
			const status = error.status || 500;
			return sendError(res, error.message || 'Error deleting faculty', status);
		}
	}
}

module.exports = FacultyController;

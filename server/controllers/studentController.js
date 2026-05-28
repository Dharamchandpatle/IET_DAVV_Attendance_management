const studentService = require('../services/studentService');
const { sendSuccess, sendError } = require('../utils/response');

// StudentController handles student profile CRUD.
class StudentController {
	// Admin/faculty list of students.
	static async getAll(req, res) {
		try {
			const students = await studentService.getAllStudents();
			return sendSuccess(res, 'Students fetched successfully', students);
		} catch (error) {
			const status = error.status || 500;
			return sendError(res, error.message || 'Error fetching students', status);
		}
	}

	// Students can only view their own record.
	static async getById(req, res) {
		try {
			const { id } = req.params;
			const student = await studentService.getStudentById(id);
			if (!student) {
				return sendError(res, 'Student not found', 404);
			}

			if (req.user?.role === 'student' && student.user_id !== req.user.id) {
				return sendError(res, 'Forbidden', 403);
			}

			return sendSuccess(res, 'Student fetched successfully', student);
		} catch (error) {
			const status = error.status || 500;
			return sendError(res, error.message || 'Error fetching student', status);
		}
	}

	// Returns the authenticated student's profile (by user id).
	static async getMyProfile(req, res) {
		try {
			const userId = req.user?.id;
			if (!userId) return sendError(res, 'Unauthorized', 401);
			const student = await studentService.getStudentById(userId);
			// studentService.getStudentById expects student id; try finding by user id instead
			const byUser = await studentService.getStudentByUserId(userId);
			if (!byUser) return sendError(res, 'Student not found', 404);
			return sendSuccess(res, 'Profile fetched', byUser);
		} catch (error) {
			const status = error.status || 500;
			return sendError(res, error.message || 'Error fetching profile', status);
		}
	}

	// Admin create student (wraps Student.createWithUser)
	static async create(req, res) {
		try {
			const payload = req.body;
			const result = await studentService.createStudent(payload);
			return sendSuccess(res, 'Student created successfully', result, 201);
		} catch (error) {
			const status = error.status || 500;
			return sendError(res, error.message || 'Error creating student', status);
		}
	}

	// Students can only update their own record.
	static async update(req, res) {
		try {
			const { id } = req.params;
			const current = await studentService.getStudentById(id);
			if (!current) {
				return sendError(res, 'Student not found', 404);
			}

			if (req.user?.role === 'student' && current.user_id !== req.user.id) {
				return sendError(res, 'Forbidden', 403);
			}

			const userUpdates = {
				name: req.body.name,
				email: req.body.email,
				phone: req.body.phone,
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

			const updated = await studentService.updateStudent(id, userUpdates, studentUpdates);
			return sendSuccess(res, 'Student updated successfully', updated);
		} catch (error) {
			const status = error.status || (error.code === 'ER_DUP_ENTRY' ? 409 : 500);
			return sendError(res, error.message || 'Error updating student', status);
		}
	}

	// Admin-only delete.
	static async remove(req, res) {
		try {
			const { id } = req.params;
			const removed = await studentService.deleteStudent(id);
			if (!removed) {
				return sendError(res, 'Student not found', 404);
			}
			return sendSuccess(res, 'Student deleted successfully');
		} catch (error) {
			const status = error.status || 500;
			return sendError(res, error.message || 'Error deleting student', status);
		}
	}
}

module.exports = StudentController;

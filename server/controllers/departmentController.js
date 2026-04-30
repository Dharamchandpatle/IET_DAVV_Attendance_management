const { getDepartments } = require('../services/departmentService');
const { sendSuccess, sendError } = require('../utils/response');

class DepartmentController {
  static async list(req, res) {
    try {
      const departments = await getDepartments();
      return sendSuccess(res, 'Departments fetched successfully', departments);
    } catch (error) {
      const status = error.status || 500;
      return sendError(res, error.message || 'Error fetching departments', status);
    }
  }
}

module.exports = DepartmentController;

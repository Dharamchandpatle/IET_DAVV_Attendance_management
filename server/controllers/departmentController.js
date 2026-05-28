const { query } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

class DepartmentController {
  static async getAll(req, res) {
    try {
      const rows = await query('SELECT id, name, code FROM departments ORDER BY name');
      return sendSuccess(res, 'Departments fetched', rows);
    } catch (error) {
      const status = error.status || 500;
      return sendError(res, error.message || 'Error fetching departments', status);
    }
  }
}

module.exports = DepartmentController;

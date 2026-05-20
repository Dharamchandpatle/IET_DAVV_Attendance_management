const attendanceService = require('../services/attendanceService');
const { sendSuccess, sendError } = require('../utils/response');

class AttendanceController {
  static async markClassAttendance(req, res) {
    try {
      // Pass the logged-in user id as the marker
      const payload = { ...req.body, marked_by: req.user.id };
      const data = await attendanceService.markClassAttendance(payload);
      return sendSuccess(res, 'Attendance marked successfully', data);
    } catch (error) {
      const status = error.status || 500;
      return sendError(res, error.message || 'Error marking attendance', status);
    }
  }

  static async getMyAttendance(req, res) {
    try {
      const data = await attendanceService.getAttendanceForUser(req.user.id);
      return sendSuccess(res, 'Attendance fetched successfully', data);
    } catch (error) {
      const status = error.status || 500;
      return sendError(res, error.message || 'Error fetching attendance', status);
    }
  }
}

module.exports = AttendanceController;

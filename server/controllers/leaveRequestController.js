const leaveRequestService = require('../services/leaveRequestService');
const { sendSuccess, sendError } = require('../utils/response');

class LeaveRequestController {
  static async create(req, res) {
    try {
      const data = await leaveRequestService.createLeaveRequest(req.user.id, req.body);
      return sendSuccess(res, 'Leave request created successfully', data, 201);
    } catch (error) {
      const status = error.status || 500;
      return sendError(res, error.message || 'Error creating leave request', status);
    }
  }

  static async list(req, res) {
    try {
      const data = await leaveRequestService.listLeaveRequests({
        role: req.user.role,
        userId: req.user.id,
        status: req.query.status,
        type: req.query.type
      });
      return sendSuccess(res, 'Leave requests fetched successfully', data);
    } catch (error) {
      const status = error.status || 500;
      return sendError(res, error.message || 'Error fetching leave requests', status);
    }
  }

  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, review_comment } = req.body;
      const result = await leaveRequestService.updateLeaveStatus(id, {
        status,
        review_comment,
        reviewerUserId: req.user.id
      });

      if (result.affectedRows === 0) {
        return sendError(res, 'Leave request not found', 404);
      }

      return sendSuccess(res, 'Leave request updated successfully');
    } catch (error) {
      const status = error.status || 500;
      return sendError(res, error.message || 'Error updating leave request', status);
    }
  }
}

module.exports = LeaveRequestController;

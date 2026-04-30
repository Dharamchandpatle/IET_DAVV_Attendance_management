const userService = require('../services/userService');
const { sendSuccess, sendError } = require('../utils/response');

// UserController manages admin and self-service user operations.
class UserController {
  // Get user by email
  static async getUserByEmail(req, res) {
    try {
      const { email } = req.params;
      const user = await userService.getUserByEmail(email);
      if (!user) {
        return sendError(res, 'User not found', 404);
      }
      return sendSuccess(res, 'User fetched successfully', user);
    } catch (error) {
      const status = error.status || 400;
      return sendError(res, error.message || 'Error fetching user', status);
    }
  }

  // Get user by ID
  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      if (!user) {
        return sendError(res, 'User not found', 404);
      }
      return sendSuccess(res, 'User fetched successfully', user);
    } catch (error) {
      const status = error.status || 400;
      return sendError(res, error.message || 'Error fetching user', status);
    }
  }

  // Get all users (admin only)
  static async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      return sendSuccess(res, 'Users fetched successfully', users);
    } catch (error) {
      const status = error.status || 400;
      return sendError(res, error.message || 'Error fetching users', status);
    }
  }

  // Update user profile
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const result = await userService.updateUser(id, req.body);
      if (result.affectedRows === 0) {
        return sendError(res, 'User not found', 404);
      }
      return sendSuccess(res, 'User updated successfully');
    } catch (error) {
      const status = error.status || 400;
      return sendError(res, error.message || 'Error updating user', status);
    }
  }

  // Update user role (admin only)
  static async updateUserRole(req, res) {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const result = await userService.updateUserRole(id, role);
      if (result.affectedRows === 0) {
        return sendError(res, 'User not found', 404);
      }
      return sendSuccess(res, 'User role updated successfully');
    } catch (error) {
      const status = error.status || 400;
      return sendError(res, error.message || 'Error updating role', status);
    }
  }

  // Update last login
  static async updateLastLogin(req, res) {
    try {
      const { id } = req.params;
      const result = await userService.updateLastLogin(id);
      if (result.affectedRows === 0) {
        return sendError(res, 'User not found', 404);
      }
      return sendSuccess(res, 'Last login updated successfully');
    } catch (error) {
      const status = error.status || 400;
      return sendError(res, error.message || 'Error updating last login', status);
    }
  }

  // Delete user (admin only)
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const result = await userService.deleteUser(id);
      if (result.affectedRows === 0) {
        return sendError(res, 'User not found', 404);
      }
      return sendSuccess(res, 'User deleted successfully');
    } catch (error) {
      const status = error.status || 400;
      return sendError(res, error.message || 'Error deleting user', status);
    }
  }
}

module.exports = UserController;
const { registerUser, loginUser, refreshToken } = require('../services/authService');
const { sendSuccess, sendError } = require('../utils/response');

class AuthController {
  // Handle user registration
  static async register(req, res) {
    try {
      const data = await registerUser(req.body);
      return sendSuccess(res, 'User registered successfully', data, 201);
    } catch (error) {
      const status = error.status || 500;
      return sendError(res, error.message || 'Error registering user', status);
    }
  }

  // Handle user login
  static async login(req, res) {
    try {
      const data = await loginUser(req.body);
      return sendSuccess(res, 'Login successful', data, 200);
    } catch (error) {
      const status = error.status || 500;
      return sendError(res, error.message || 'Error logging in', status);
    }
  }

  // Handle user logout
  static async logout(req, res) {
    return sendSuccess(res, 'Logout successful', null, 200);
  }

  // Handle token refresh
  static async refreshToken(req, res) {
    try {
      const data = await refreshToken(req.body.token);
      return sendSuccess(res, 'Token refreshed successfully', data, 200);
    } catch (error) {
      const status = error.status || 401;
      return sendError(res, error.message || 'Invalid or expired token', status);
    }
  }
}

module.exports = AuthController;
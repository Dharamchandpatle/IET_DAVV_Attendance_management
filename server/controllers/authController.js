const { registerUser, loginUser, refreshToken } = require('../services/authService');
const { sendSuccess, sendError } = require('../utils/response');

// Handles auth flows for login/register and token refresh.
class AuthController {
  static async register(req, res) {
    try {
      const data = await registerUser(req.body);
      return sendSuccess(res, 'User registered successfully', data, 201);
    } catch (error) {
      const status = error.status || (error.message === 'Email already exists' ? 409 : 500);
      return sendError(res, error.message || 'Error registering user', status);
    }
  }

  static async login(req, res) {
    try {
      const data = await loginUser(req.body);
      return sendSuccess(res, 'Login successful', data);
    } catch (error) {
      const status = error.status || 500;
      return sendError(res, error.message || 'Error logging in', status);
    }
  }

  static async logout(req, res) {
    return sendSuccess(res, 'Logout successful');
  }

  static async refreshToken(req, res) {
    try {
      const data = await refreshToken(req.body.token);
      return sendSuccess(res, 'Token refreshed successfully', data);
    } catch (error) {
      const status = error.status || 401;
      return sendError(res, error.message || 'Invalid or expired token', status);
    }
  }
}

module.exports = AuthController;
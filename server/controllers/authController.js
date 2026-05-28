const { registerUser, loginUser, refreshToken } = require('../services/authService');
const { sendSuccess, sendError } = require('../utils/response');

class AuthController {
  static async register(req, res) {
    try {
      const result = await registerUser(req.body);
      return sendSuccess(res, 'User registered', result, 201);
    } catch (err) {
      return sendError(res, err.message || 'Registration failed', err.status || 400);
    }
  }

  static async login(req, res) {
    try {
      const result = await loginUser(req.body);
      return sendSuccess(res, 'Login successful', result, 200);
    } catch (err) {
      return sendError(res, err.message || 'Login failed', err.status || 401);
    }
  }

  static async logout(req, res) {
    // For this simple implementation we don't need server-side logout logic.
    return sendSuccess(res, 'Logout successful', null, 200);
  }

  static async refreshToken(req, res) {
    try {
      const token = req.body.token;
      const data = await refreshToken(token);
      return sendSuccess(res, 'Token refreshed', data, 200);
    } catch (err) {
      return sendError(res, err.message || 'Invalid token', err.status || 401);
    }
  }
}

module.exports = AuthController;
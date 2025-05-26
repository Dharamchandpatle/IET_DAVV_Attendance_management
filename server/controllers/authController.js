const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwtUtils');

class AuthController {
  static async register(req, res) {
    try {
      const { name, email, password, role, phone, profile_image } = req.body;
      if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Name, email, password, and role are required' });
      }
      if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
      }
      const result = await User.createUser(name, email, password, role, phone, profile_image);
      const token = generateToken({ id: result.insertId, role });
      res.status(201).json({
        id: result.insertId,
        token,
        message: 'User registered successfully'
      });
    } catch (error) {
      if (error.message === 'Email already exists') {
        return res.status(409).json({ message: error.message });
      }
      if (error.message.includes('Email must end with')) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: 'Error registering user', error: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
      const user = await User.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      await User.updateLastLogin(user.id);
      const token = generateToken({ id: user.id, role: user.role });
      res.json({
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        message: 'Login successful'
      });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error: error.message });
    }
  }

  static async logout(req, res) {
    res.json({ message: 'Logout successful. Please remove the token from client storage.' });
  }

  static async refreshToken(req, res) {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({ message: 'Token is required' });
      }
      const decoded = require('../utils/jwtUtils').verifyToken(token);
      const newToken = generateToken({ id: decoded.id, role: decoded.role });
      res.json({ token: newToken, message: 'Token refreshed successfully' });
    } catch (error) {
      res.status(401).json({ message: 'Invalid or expired token', error: error.message });
    }
  }
}

module.exports = AuthController;
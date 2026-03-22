const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwtUtils');

class UserController {
  // Register a new user
  static async register(req, res) {
    try {
      const { name, email, password, role, phone, profile_image } = req.body;
      const result = await User.createUser(name, email, password, role, phone, profile_image);
      const token = generateToken({ id: result.insertId, role });
      res.status(201).json({ id: result.insertId, token, message: 'User created successfully' });
    } catch (error) {
      res.status(400).json({ message: 'Error creating user', error: error.message });
    }
  }

  // Login user
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findUserByEmail(email);
      if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      await User.updateLastLogin(user.id);
      const token = generateToken({ id: user.id, role: user.role });
      res.json({ token, message: 'Login successful' });
    } catch (error) {
      res.status(400).json({ message: 'Error logging in', error: error.message });
    }
  }

  // Get user by email
  static async getUserByEmail(req, res) {
    try {
      const { email } = req.params;
      const user = await User.findUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: 'Error fetching user', error: error.message });
    }
  }

  // Get user by ID
  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findUserById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: 'Error fetching user', error: error.message });
    }
  }

  // Get all users (admin only)
  static async getAllUsers(req, res) {
    try {
      const users = await User.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(400).json({ message: 'Error fetching users', error: error.message });
    }
  }

  // Update user profile
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, email, phone, profile_image, is_active } = req.body;
      const result = await User.updateUser(id, name, email, phone, profile_image, is_active);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'User updated successfully' });
    } catch (error) {
      res.status(400).json({ message: 'Error updating user', error: error.message });
    }
  }

  // Update user role (admin only)
  static async updateUserRole(req, res) {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const result = await User.updateUserRole(id, role);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'User role updated successfully' });
    } catch (error) {
      res.status(400).json({ message: 'Error updating role', error: error.message });
    }
  }

  // Update last login
  static async updateLastLogin(req, res) {
    try {
      const { id } = req.params;
      const result = await User.updateLastLogin(id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'Last login updated successfully' });
    } catch (error) {
      res.status(400).json({ message: 'Error updating last login', error: error.message });
    }
  }

  // Delete user (admin only)
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const result = await User.deleteUser(id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: 'Error deleting user', error: error.message });
    }
  }
}

module.exports = UserController;
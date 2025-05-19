const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Add this helper function at the top of the file
const isValidInstitutionalEmail = (email) => {
  const allowedDomain = process.env.ALLOWED_EMAIL_DOMAIN || 'ietdavv.edu.in';
  return email.endsWith(`@${allowedDomain}`);
};

// Register a new user (admin only)
exports.register = async (req, res) => {
  try {
    // This endpoint should be protected and only accessible by admins
    const { email } = req.body;
    
    // Check if email is from the institutional domain
    if (!isValidInstitutionalEmail(email)) {
      return res.status(400).json({ 
        message: 'Registration failed. Only @ietdavv.edu.in email addresses are allowed.' 
      });
    }
    
    // Continue with existing registration logic...
    res.status(403).json({ message: 'Direct registration is not allowed. Please contact your administrator.' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Check if email is from the institutional domain
    if (!isValidInstitutionalEmail(email)) {
      return res.status(401).json({ 
        message: 'Login failed. Only @ietdavv.edu.in email addresses are allowed.' 
      });
    }
    
    // Find user by email
    const user = await UserModel.findByEmail(email);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    // Remove password from user object
    delete user.password;
    
    res.status(200).json({
      message: 'Login successful',
      token,
      user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    // User is already authenticated via middleware
    const userId = req.user.id;
    
    // Get user details
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove password from user object
    delete user.password;
    
    res.status(200).json({
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    
    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }
    
    // Get user with password
    const user = await UserModel.findById(userId, true);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    await UserModel.updatePassword(userId, hashedPassword);
    
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error while changing password' });
  }
}; 
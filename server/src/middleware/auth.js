const jwt = require('jsonwebtoken');
require('dotenv').config();

// Update the helper function to use environment variable
const isValidInstitutionalEmail = (email) => {
  const allowedDomain = process.env.ALLOWED_EMAIL_DOMAIN || 'ietdavv.edu.in';
  return email.endsWith(`@${allowedDomain}`);
};

const authenticate = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify email domain in the token
    if (!isValidInstitutionalEmail(decoded.email)) {
      return res.status(401).json({ 
        message: 'Authentication failed. Only @ietdavv.edu.in email addresses are allowed.' 
      });
    }
    
    // Add user info to request
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access forbidden' });
    }
    
    next();
  };
};

module.exports = { authenticate, authorize }; 
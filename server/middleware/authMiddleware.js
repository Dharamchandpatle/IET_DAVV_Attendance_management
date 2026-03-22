const { verifyToken } = require('../utils/jwtUtils');

module.exports = (roles = []) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('No token provided');
      const decoded = verifyToken(token);
      req.user = decoded;
      if (roles.length && !roles.includes(decoded.role)) {
        throw new Error('Unauthorized');
      }
      next();
    } catch (error) {
      res.status(401).json({ message: 'Unauthorized', error: error.message });
    }
  };
};
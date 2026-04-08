const { verifyToken } = require('../utils/jwtUtils');

// Middleware factory for JWT auth + role checks.
module.exports = (roles = []) => (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;

    if (roles.length && !roles.includes(decoded.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
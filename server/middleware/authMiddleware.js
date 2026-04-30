const { verifyToken } = require('../utils/jwtUtils');
const { sendError } = require('../utils/response');

// Middleware factory for JWT auth + role checks.
module.exports = (roles = []) => (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return sendError(res, 'Unauthorized', 401);
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;

    if (roles.length && !roles.includes(decoded.role)) {
      return sendError(res, 'Forbidden', 403);
    }

    return next();
  } catch (error) {
    return sendError(res, 'Unauthorized', 401);
  }
};
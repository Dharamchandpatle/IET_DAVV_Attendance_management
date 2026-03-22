const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');

exports.generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: '1h' });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, jwtSecret);
};
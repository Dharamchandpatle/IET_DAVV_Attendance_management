const dotenv = require('dotenv');
dotenv.config();

const readEnv = (name, fallback = '') => {
  const value = process.env[name];
  return value === undefined ? fallback : value;
};

const parseList = (value) => value
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);

// Centralized environment config for the server.
module.exports = {
  dbHost: readEnv('DB_HOST', 'localhost'),
  dbName: readEnv('DB_NAME', 'iet_davv_db'),
  dbUser: readEnv('DB_USER', 'root'),
  dbPass: readEnv('DB_PASS', ''),
  dbPort: Number(readEnv('DB_PORT', '3306')),
  jwtSecret: readEnv('JWT_SECRET', 'dev-secret-change-me'),
  port: Number(readEnv('PORT', '5000')),
  host: readEnv('HOST', '0.0.0.0'),
  nodeEnv: readEnv('NODE_ENV', 'development'),
  frontendOrigin: readEnv('FRONTEND_ORIGIN', 'http://localhost:5173'),
  corsOrigins: parseList(readEnv('CORS_ORIGIN', ''))
};
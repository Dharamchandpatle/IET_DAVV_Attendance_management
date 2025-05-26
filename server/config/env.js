const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  dbPass: process.env.DB_PASS,
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT || 5000
};
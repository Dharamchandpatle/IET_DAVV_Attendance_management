const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();  // Load environment variables from .env

// MySQL Connection Configuration
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('MySQL Connection Failed:', err);
    } else {
        console.log('Connected to MySQL Database Successfully');
    }
});

module.exports = db;

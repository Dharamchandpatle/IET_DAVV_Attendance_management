const mysql = require('mysql2/promise');
const { dbHost, dbUser, dbPass, dbName, dbPort } = require('./env');

// Shared MySQL connection pool for the app.
const pool = mysql.createPool({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPass,
    database: dbName,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000
});

// Executes a prepared statement and returns result rows.
const query = async (sql, params = []) => {
    const [rows] = await pool.execute(sql, params);
    return rows;
};

// Runs a callback within a DB transaction and returns its result.
const withTransaction = async (work) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const result = await work(connection);
        await connection.commit();
        return result;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

// Verifies the database connection during startup.
const testConnection = async () => {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
};

module.exports = {
    pool,
    query,
    withTransaction,
    testConnection
};

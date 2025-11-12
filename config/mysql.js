const mysql = require('mysql2/promise');

// Create a reusable MySQL pool. Reads credentials from environment variables
// Defaults are provided based on the user-supplied host/user/password.
// Set `MYSQL_DB` in your .env to the correct database/schema name.
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || '35.219.123.154',
  user: process.env.MYSQL_USER || 'eurekadev',
  password: process.env.MYSQL_PASSWORD || 'eurekadev20252025',
  database: process.env.MYSQL_DB || undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: 'Z'
});

module.exports = pool;
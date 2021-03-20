const mysql = require('mysql2');

require('dotenv').config();

//Create connection pull
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
});

module.exports = pool.promise();

require('dotenv').config();

const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'marybill_conglomeratedb',
});

module.exports = db;
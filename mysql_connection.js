/**
 * Database Config
 */
mysql = require('mysql');

// 環境変数
const env = process.env;

const connection = mysql.createConnection({
  host:     env.DB_HOST,
  user:     env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_DBNAME
});

module.exports = connection;
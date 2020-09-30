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

// MySQL connection
// connection.connect((err) => {
//   if (err) {
//     console.log('error connecting: ' + err.stack);
//     return;
//   }
//   console.log('DB connected...');
// });

module.exports = connection;
/**
 * Database Config
 */
mysql = require('mysql');

// 環境変数
const env = process.env;

const db_config = {
  host:     env.DB_HOST,
  user:     env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_DBNAME,
  acquireTimeout: 60000 // 60秒
};

function handleDisconnect() {
  console.log('INFO.CONNECTION_DB: ');
  connection = mysql.createConnection(db_config);
  
  //connection取得
  connection.connect(function(err) {
      if (err) {
          console.log('ERROR.CONNECTION_DB: ', err);
          setTimeout(handleDisconnect, 1000);
      }
  });
  
  //error('PROTOCOL_CONNECTION_LOST')時に再接続
  connection.on('error', function(err) {
      console.log('ERROR.DB: ', err);
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
          console.log('ERROR.CONNECTION_LOST: ', err);
          handleDisconnect();
      } else {
          throw err;
      }
  });
}

handleDisconnect();

module.exports = connection;
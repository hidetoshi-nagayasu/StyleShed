const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mysql = require('mysql');
const app = express();

// 環境変数
const env = process.env;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/**
 * Routing
 */
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

app.use('/', indexRouter);
app.use('/users', usersRouter);


/**
 * Database Config
 */
const connection = mysql.createConnection({
  host:     env.DB_HOST,
  user:     env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_DBNAME
});

// MySQL connection
connection.connect((err) => {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return;
  }
  console.log('DB connected...');
});

app.get('/db', (req, res) => {
  connection.query(
    'SELECT * FROM test',
    (error, results) => {
      console.log(results);
      res.render('index', { title: 'MySQL' });
    }
  );
});


/**
 * Error Handler
 */
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

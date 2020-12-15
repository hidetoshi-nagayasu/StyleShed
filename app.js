const createError   = require('http-errors');
const express       = require('express');
const path          = require('path');
const cookieParser  = require('cookie-parser');
const logger        = require('morgan');
const session       = require('express-session');
const flash         = require('express-flash');
const i18n          = require("i18n");

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/**
 * Session
 */
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

app.use(function(req, res, next){
  res.locals.session = req.session;
  next();
});

app.use(flash());


/**
 * Assets directory
 */
app.use("/jquery", express.static(__dirname + "/node_modules/jquery/dist"));
app.use("/codemirror", express.static(__dirname + "/node_modules/codemirror"));


/**
 * i18n
 */
// 多言語化の利用設定
i18n.configure({
  // 利用するlocalesを設定。これが辞書ファイルとひも付きます
  locales: ['ja', 'en'],
  defaultLocale: 'en',
  // 辞書ファイルのありかを指定
  directory: __dirname + "/locales",
  // オブジェクトを利用したい場合はtrue
  objectNotation: true
});
 
app.use(i18n.init);
 
// manualでi18nセッション管理できるように設定しておきます
app.use(function (req, res, next) {
  if (req.session.locale) {
    i18n.setLocale(req, req.session.locale);
  }
  next();
});


/**
 * Ignore Favicon
 */
const ignoreFavicon = (req, res, next) => {
  if (req.originalUrl === '/favicon.ico') {
    res.status(204).json({nope: true});
  } else {
    next();
  }
}

/**
 * Routing
 */
const indexRouter    = require('./routes/index');
const userRouter     = require('./routes/user');
const codeRouter     = require('./routes/code');
const authRouter     = require('./routes/auth');
const settingRouter  = require('./routes/setting'); 
const categoryRouter = require('./routes/category');

app.use(ignoreFavicon);
app.use('/', indexRouter);
app.use('/code', codeRouter);
app.use('/auth', authRouter);
app.use('/setting', settingRouter);
app.use('/category', categoryRouter);
app.use('/', userRouter);


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

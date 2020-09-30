const express     = require('express');
const router      = express.Router();
const moment      = require('moment');
const connection  = require('../mysql_connection');
const query       = require('../repository/auth');
const message     = require('../message_const');
const bcrypt      = require('bcrypt');

// 正規表現定義
const usernamePattern = /^[a-zA-Z0-9_\-.]{3,20}$/;
const emailPattern    = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;

/**
 * ログイン画面遷移
 * @method GET
 */
router.get('/signin', function(req, res, next) {
  if (req.session && req.session.user) {
    res.redirect('/');
  } else {
    res.render('auth/signin', {});
  }
});

/**
 * ログイン実行処理
 * @method POST
 */
router.post('/signin', function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  const getUserQuery = query.LoginUser(email);

  connection.query(getUserQuery, function(err, rows) {
    const record = rows[0];
    const userId = rows.length ? record.id : false;
    if (userId) {

      // パスワード照合
      const canLogin = bcrypt.compareSync(password, rows[0].password)

      // ログイン可能な場合
      if(canLogin) {

        // セッションの値をuserオブジェクトに設定
        const user = {
          id: record.id,
          username: record.user_name,
          email: record.email
        };

        // セッション格納
        req.session.user = user;

        res.redirect('/');
      } else {
        res.render('auth/signin', {
          title: 'ログイン',
          noUser: message.LOGIN_NO_USER
        });
      }

    } else {
      res.render('auth/signin', {
        title: 'ログイン',
        noUser: message.LOGIN_NO_USER
      });
    }
  });
});


/**
 * ユーザー登録画面遷移
 * @method GET
 */
router.get('/signup', function(req, res, next) {
  console.log('get');
  res.render('auth/signup', {});
});

/**
 * ユーザー登録処理
 * @method POST
 */
router.post('/signup', function(req, res, next) {

  // 入力情報バリデーション
  const errorObject = validateSignUpData(req.body);

  console.log(errorObject);
  if(errorObject.hasError) {
    res.render('auth/signup', {
      errorObject: errorObject
    });
    return;
  }

  // request data
  const username  = req.body.username;
  const email     = req.body.email;
  const password  = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10); // パスワードハッシュ化
  const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');

  // query
  const emailExistsQuery = query.emailExists(email); 
  const registerQuery = query.registerUser(username, email, hashedPassword, createdAt);

  // メールアドレス存在チェック
  connection.query(emailExistsQuery, function(err, user) {
    console.log(user);

    // 既に登録されている場合
    if(user.length) {
      console.log(`Email exists. '${user[0].email}'`);
      res.render('auth/signup', {
        errorMessage: message.SIGNUP_EMAIL_ALREADY_EXISTS
      });
    } else {
      // ユーザー登録
      connection.query(registerQuery, function(err, rows) {
        if(err) {
          console.log(err.stack);
          res.render('auth/signup', {
            errorMessage: message.ERROR_NOT_COMPLETED
          });
        }
        res.redirect('/auth/signin');
      });
    }
  });
});

/**
 * Signup時の入力情報バリデーション
 * @param {*} input 
 */
const validateSignUpData = (input) => {

  const errorObject = {
    hasError: false,
    errorMessage: {}
  };

  const username = input.username;
  const email    = input.email;
  const password = input.password;

  // usernameチェック
  if(!username.match(usernamePattern)) {
    errorObject.hasError = true;
    errorObject.errorMessage.usernameInvalid = message.SIGNUP_INVALID_USERNAME;
  }

  // emailチェック
  if(!email.match(emailPattern)) {
    errorObject.hasError = true;
    errorObject.errorMessage.emailInvalid = message.SIGNUP_INVALID_EMAIL;
  }

  // passwordチェック
  if(!password.match(passwordPattern)) {
    errorObject.hasError = true;
    errorObject.errorMessage.passwordInvalid = message.SIGNUP_INVALID_PASSWORD;
  }

  return errorObject;
}


/**
 * ログアウト処理
 * @method GET
 */
router.get('/signout', function(req, res, next) {
  req.session.destroy(function(err) {
    console.log(req.session);
    res.redirect('/auth/signin');
  });
});


module.exports = router;

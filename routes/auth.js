const express       = require('express');
const router        = express.Router();
const moment        = require('moment-timezone');
const connection    = require('../mysql_connection');
const query         = require('../repository/auth');
const message       = require('../message_const');
const bcrypt        = require('bcrypt');
const {randomBytes} = require('crypto');
const smtp          = require('../nodemailer');
const app_const     = require('../app_const');
const { resolve }   = require('path');
const { logger }    = require('../nodemailer');

/**
 * 正規表現定義
 */
// ユーザー名：大文字小文字英数字「_」「-」「.」が利用可能で3〜20文字
const usernamePattern = /^[a-zA-Z0-9_\-.]{3,20}$/;

// Emailパターン
const emailPattern    = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

// パスワード：大文字小文字英数字を組み合わせて8〜20文字
const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;

// パスワードリセットメールの有効期限：24時間
const passwordResetMailExpiration = 24;

/**
 * ログイン画面遷移
 * @method GET
 */
router.get('/signin', (req, res, next) => {
  if (req.session && req.session.user) {
    res.redirect('/');
  } else {

    // req.flash('success', message.SIGNUP_SUCCESS);
    res.render('auth/signin', {
      flash: {
        success: req.flash('success')
      }
    });
  }
});


/**
 * ユーザー登録画面遷移
 * @method GET
 */
router.get('/signup', (req, res, next) => {
  res.render('auth/signup', {});
});


/**
 * パスワード忘れ画面遷移
 */
router.get('/password_reset', (req, res, next) => {
  res.render('auth/password_reset', {});
});

/**
 * パスワード忘れメール送信完了画面遷移
 */
router.get('/password_reset_complete', (req, res, next) => {
  res.render('auth/password_reset_complete', {});
});


/**
 * ログイン実行処理
 * @method POST
 */
router.post('/signin', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const getUserQuery = query.LoginUser(email);

  connection.query(getUserQuery, [email], (err, rows) => {
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

        // 最終ログイン日時を保存
        const lastLoginQuery = query.updateLastLoginAt();
        const setParams = [moment().tz(app_const.TIME_ZONE).format("YYYY-MM-DD HH:mm:ss"), record.id];

        connection.query(lastLoginQuery, setParams, (err, updateResult) => {
          if(err) {
            console.log('Setting last_login_at failed.');
          }
        });

        // セッション格納
        req.session.user = user;
        req.flash('login_success', message.LOGIN_SUCCESS);

        // セッションに遷移先URLが格納されている場合はそのURLにリダイレクト
        if(req.session && req.session.url) {
          console.log(req.session.url);
          res.redirect(req.session.url);
        } else {
          res.redirect('/');
        }
      } else {
        req.flash('fail', message.LOGIN_FAILED)
        res.render('auth/signin', {
          flash: {
            fail: message.LOGIN_FAILED
          }
        });
      }

    } else {
      res.render('auth/signin', {
        flash: {
          fail: message.LOGIN_FAILED
        }
      });
    }
  });
});


/**
 * ユーザー登録処理
 * @method POST
 */
router.post('/signup', (req, res, next) => {

  // input data
  const username  = req.body.username;
  const email     = req.body.email;
  const password  = req.body.password;

  // return用入力情報
  const inputObject = {
    username: username,
    email: email
  };

  // 入力情報バリデーション
  const errorObject = validateSignUpData(req.body);

  if(errorObject.hasError) {
    res.render('auth/signup', {
      inputObject: inputObject,
      errorObject: errorObject
    });
    return;
  }

  // plus data
  const hashedPassword = bcrypt.hashSync(password, 10); // パスワードハッシュ化
  const createdAt = moment().tz(app_const.TIME_ZONE).format("YYYY-MM-DD HH:mm:ss");

  // query
  const userExistsQuery = query.userExists(); 
  const registerQuery = query.registerUser();
  const registerQueryParams = [username, email, hashedPassword, createdAt, createdAt];

  // ユーザー名とメールアドレスの存在チェック
  connection.query(userExistsQuery, [username, email], (err, result) => {
    if(err) {
      console.log('Error occurred when username and email check...');
      res.render('auth/auth_error', {});
      return;
    }

    // ユーザー名が存在する場合
    if(result.length && result[0].username_exists > 0) {
      console.log(`Username exists. '${username}'`);
      errorObject.hasError = true;
      errorObject.errorMessage.usernameInvalid = message.SIGNUP_USERNAME_ALREADY_EXISTS;
    }

    // Emailが存在する場合
    if(result.length && result[0].email_exists > 0) {
      console.log(`Email exists. '${email}'`);
      errorObject.hasError = true;
      errorObject.errorMessage.emailInvalid = message.SIGNUP_EMAIL_ALREADY_EXISTS;
    }

    if(errorObject.hasError) {
      res.render('auth/signup', {
        inputObject: inputObject,
        errorObject: errorObject
      });
      return;
    }

    // ユーザー登録
    connection.query(registerQuery, registerQueryParams, (err, rows) => {
      if(err) {
        console.log(err.stack);
        res.render('auth/signup', {
          inputObject: inputObject,
          flash: {
            fail: message.ERROR_NOT_COMPLETED
          }
        });
      }

      req.flash('success', message.SIGNUP_SUCCESS);
      res.redirect('/auth/signin');
    });
  });
});


/**
 * Signup時の入力情報バリデーション
 * @param {*} input 
 */
function validateSignUpData(input) {

  const errorObject = {
    hasError: false,
    errorMessage: []
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
 * パスワード忘れメール送信実行
 */
router.post('/password_reset', (req, res, next) => {

  const email = req.body.email;

  const inputObject = {
    email: email
  };

  // 入力されたメールアドレスの正規表現チェック
  if(!email.match(emailPattern)) {

    const errorObject = {
      hasError: true,
      errorMessage: {
        emailInvalid: message.SIGNUP_INVALID_EMAIL
      }
    };

    res.render('auth/password_reset', {
      inputObject: inputObject,
      errorObject: errorObject
    });
    return;
  }

  // query
  const findUserQuery = query.findUserByEmail();

  (async () => {
    try {
      const params = await findUser(findUserQuery, email);
      const result = await updateUser(params, email, res);
    } catch(e) {
      console.log('Error occurred!');
      console.log(e);
    }
  })();

});

/**
 * メールアドレスが存在するユーザーを特定し、リセットトークンと現在時刻をセットする
 * @param {*} findUserQuery 
 * @param {*} email
 */
async function findUser(findUserQuery, email) {
  return new Promise(resolve => {
    connection.query(findUserQuery, [email], (err, users) => {
      if(err) {
        throw new Error('Finding user by email failed...');
      }

      var params = {};

      if(users.length) {
        const id = users[0].id;
        const username = users[0].user_name;

        // URLパラメーター用のランダム文字列を生成
        const len = 32;
        const resetToken = generateRandomString(len);

        // 現在時刻を取得（有効期限：24時間）
        const currentTime = moment().tz(app_const.TIME_ZONE).format("YYYY-MM-DD HH:mm:ss");

        params = {
          id: id,
          username: username,
          resetToken: resetToken,
          currentTime: currentTime
        };
      }

      resolve(params);
    });
  });
}


/**
 * userテーブルにパスワードリセット用のトークンと現在時刻をアップデートする処理
 * @param {*} params 
 * @param {*} email
 */
async function updateUser(params, email, res) {
  return new Promise(resolve => {
    console.log(params);
    if(!params) {
      throw new Error;
    }

    const updateQuery = query.updatePasswordResetToken();
    const updateQueryParams = [params.resetToken, params.currentTime, params.id];

    // パスワードリセット用のトークンと現在時刻をセット
    connection.query(updateQuery, updateQueryParams, (err, result) => {
      console.log(result);

      if(err) {
        throw new Error;
      }

      sendPasswordResetMail(email, params);
      res.redirect(301, '/auth/password_reset_complete');
    });
  });
}


/**
 * パスワードリセット用のメールを送信する処理
 * @param {*} email 
 */
function sendPasswordResetMail(email, params) {
  const passwordResetMailText = `
  <p>以下のリンクからパスワード再設定を行ってください。</p>
  <p><a href="${app_const.APP_URL}auth/password_reset/${params.username}/${params.resetToken}">パスワード再設定</a></p>
  <p>リンクの有効期限は24時間です。</p>
  <p>____</p>
  <p><a href="${app_const.APP_URL}">${app_const.APP_TITLE}</a></p>
  `;

  const contents = {
    from: app_const.EMAIL_FROM,
    to: email,
    subject: `パスワードの再設定 - ${app_const.APP_TITLE}`,
    html: passwordResetMailText
  };

  smtp.sendMail(contents, (err, success) => {
    // エラー発生時
    if(err){
      console.log(err);
      throw new Error;
    }
  
    // 送信成功
    console.log("パスワード忘れメール送信完了");
    console.log(success.messageId);
  });
}


/**
 * パスワードリセットメールのリンク押下時の処理
 * @METHOD GET
 */
router.get('/password_reset/:username/:token', (req, res, next) => {
  const username = req.params.username;
  const token = req.params.token;

  // tokenに一致するuserのidとメール送信時刻をDBから取得
  const matchTokenQuery = query.fetchUserMatchToken();
  connection.query(matchTokenQuery, [token], (err, rows) => {
    if(err) {
      console.log(err.stack);
      res.render('auth/auth_error', {});
      return;
    }

    if(!rows.length) {
      console.log('トークンに一致するユーザーが見つかりませんでした。');
      res.render('auth/auth_error', {});
      return;
    }

    // メール送信時刻と現在時刻を比較し、24時間以内であれば新規パスワード登録画面へ、そうでない場合はエラー画面へ遷移
    const user = rows[0];
    const resetSentAt = moment(user.password_reset_sent_at);
    const currentTime = moment().tz(app_const.TIME_ZONE);
    const difference = resetSentAt.diff(currentTime, 'hours');

    if(difference < passwordResetMailExpiration) {
      res.render('auth/password_reset_new', {
        username: username,
        token: token
      });
    } else {
      res.render('auth/auth_error', {});
    }
  });
});


/**
 * パスワードリセット時の新規パスワード設定処理
 * @METHOD POST
 */
router.post('/password_reset/:username/:token', (req, res, next) => {
  const username = req.params.username;
  const token = req.params.token;
  const newPassword = req.body.password;

  // passwordチェック
  if(!newPassword.match(passwordPattern)) {

    const errorObject = {
      hasError: true,
      errorMessage: {
        passwordInvalid: message.SIGNUP_INVALID_PASSWORD
      }
    };

    res.render('auth/password_reset_new', {
      errorObject: errorObject
    });
    return;
  }

  const hashedPassword = bcrypt.hashSync(newPassword, 10); // パスワードハッシュ化

  // usernameとtokenをもとに、パスワードをアップデート
  const passwordUpdateQuery = query.updatePasswordWhenReset();
  const passwordUpdateQueryParams = [hashedPassword, username, token];
  connection.query(passwordUpdateQuery, passwordUpdateQueryParams, (err, rows) => {
    if(err) {
      console.log(err.stack);
      res.render('auth/auth_error', {});
      return;
    }

    if(!rows) {
      console.log('パスワードアップデート処理に失敗しました。');
      res.render('auth/auth_error', {});
      return;
    }

    req.flash('success', message.PASSWORD_UPDATE_SUCCESS);
    res.redirect('/auth/signin');
  })

});


/**
 * ログアウト処理
 * @method GET
 */
router.get('/signout', (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect('/auth/signin');
  });
});


/**
 * ランダム文字列生成
 * @param {*} length 
 */
function generateRandomString(length) {
  return randomBytes(length).reduce((p, i) => p + (i % 32).toString(32), '');
}


module.exports = router;

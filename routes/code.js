const express     = require('express');
const router      = express.Router();
const moment      = require('moment');
const connection  = require('../mysql_connection');
const query       = require('../repository/code');
const message     = require('../message_const');
const { unique } = require('jquery');

/**
 * 新規コーディング画面遷移
 * @method GET
 */
router.get('/', (req, res, next) => {
  // res.render('code/code', { title: 'Code' });
  if (req.session && req.session.user) {
    res.locals.user = req.session.user;
    console.log(req.session.user);
    res.render('code/code', { code_title: 'Untitled' });
  } else {
    req.session.url = req.originalUrl; 
    res.redirect('/auth/signin');
  }
});


/**
 * コーディング編集画面遷移
 * @method GET
 */
router.get('/edit/:uniqueId', (req, res, next) => {
  if(!req.session || !req.session.user) {
    req.session.url = req.originalUrl;
    res.redirect('/auth/signin');
  }

  const uniqueId = req.params.uniqueId;
  const getCodeInfoQuery = query.getCodeInfo();

  connection.query(getCodeInfoQuery, uniqueId, (err, result) => {
    if(err) {
      console.log('Getting code info failed.');
      res.render('error');
    }

    if(result.length > 0) {
      const codeTitle = result[0].title;

      // TODO: ファイル情報を取得

      const resultObj = {
        code_title: codeTitle
      }

      res.render('code/code', resultObj);
    } else {
      res.render('error');
    }
  });
});


/**
 * [Ajax]
 * コード保存ボタン押下時の保存処理
 * @return json result
 */
router.post('/save', (req, res, next) => {
  let result = {"key": "value"};
  res.json(result);
});

/**
 * [Ajax]
 * タイトル保存処理
 * @return json result
 */
router.post('/title/save', (req, res, next) => {
  const title = req.body.title;
  let uniqueId = req.body.uniqueId;
  let resJson = {
    isError: false
  };

  // タイトルの空欄チェック
  if(!title || !title.match(/\S/g)) {
    resJson.isError = true; 
    res.json(resJson);
  }

  // セッションチェック
  if(!req.session || !req.session.user) {
    resJson.isError = true;
    res.json(resJson);
  }

  const userId = req.session.user.id;

  // uniqueIdがあれば更新、なければ新規登録
  if(uniqueId) {
    const updateCodeTitleQuery = query.updateCodeTitle();
    const updateParams = [title, userId, uniqueId];

    // コードタイトルのUpdate実行
    connection.query(updateCodeTitleQuery, updateParams, (err, updateResult) => {
      if(err) {
        console.log('Updating code title failed.');
        resJson.isError = true;
        res.json(resJson);
      }

      resJson.newTitle = title;
      res.json(resJson);
      return;
    });

  } else {

    // uniqueId生成
    uniqueId = generateUniqueString();

    const insertCodeQuery = query.insertCode();
    const insertParams = [userId, uniqueId, title, userId, userId];

    // Insert実行
    connection.query(insertCodeQuery, insertParams, (err, result) => {
      if(err) {
        console.log('Creating code data failed.');
        resJson.isError = true; 
        res.json(resJson);
      }

      resJson.newTitle = title;
      resJson.uniqueId = uniqueId;
      res.json(resJson);
      return;
    });
  }
});

const generateUniqueString = (myStrong) => {
  let strong = 1000;
  if (myStrong) strong = myStrong;
  return new Date().getTime().toString(16)  + Math.floor(strong*Math.random()).toString(16);
}

module.exports = router;

const express = require('express');
const message = require('../message_const');
const router = express.Router();

/**
 * TOPページ遷移
 * @method GET
 */
router.get('/', (req, res, next) => {
  if (req.session && req.session.user) {
    res.locals.user = req.session.user;
  }

  res.render('index', {
    flash: req.flash('login_success', message.LOGIN_SUCCESS)
  });
});


/**
 * 検索結果
 * @method GET
 */
router.get('/search', (req, res, next) => {
  if (req.session && req.session.user) {
    res.locals.user = req.session.user;
  }

  let keyword = req.query.keyword;
  console.log(keyword);
  res.render('index', {
    keyword: keyword
  });
});

module.exports = router;

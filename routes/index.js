const express = require('express');
const message = require('../message_const');
const router = express.Router();
const connection = require('../mysql_connection');
const query = require('../repository/index');
const app_const = require('../app_const');

/**
 * TOPページ遷移
 * @method GET
 */
router.get('/', (req, res, next) => {
  if (req.session && req.session.user) {
    res.locals.user = req.session.user;
  }

  res.render('index', {
    username: req.params.username,
    category: app_const.SIDEBAR_CATEGORY
  });

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
  let pageTitle = `Search: "${keyword}"`;
  res.render('index', {
    keyword: keyword,
    category: app_const.SIDEBAR_CATEGORY,
    header_item: {
      page_title: pageTitle,
    },
  });
});

module.exports = router;

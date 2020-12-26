const express = require('express');
const message = require('../message_const');
const router = express.Router();

router.get('/accordion', (req, res, next) => {
  if (req.session && req.session.user) {
    res.locals.user = req.session.user;
  }

  const username = req.params.username;
  const page_title = getPageTitle(req.path);
  const page_description = "成功や注意などをユーザーに知らせるアラート。<br>目に入りやすいデザインがおすすめ。";

  res.render('index', {
    username: username,
    header_item: {
      page_title: page_title,
      page_description: page_description
    }
  });
});

router.get('/alert', (req, res, next) => {
  if (req.session && req.session.user) {
    res.locals.user = req.session.user;
  }

  const username = req.params.username;
  const page_title = getPageTitle(req.path);
  const page_description = "成功や注意などをユーザーに知らせるアラート。<br>目に入りやすいデザインがおすすめ。";

  res.render('index', {
    username: username,
    header_item: {
      page_title: page_title,
      page_description: page_description
    }
  });
});

/**
 * @params str 文字列
 */
const getPageTitle = (path) => {
  let result = path.split('/').join('');
  return result.charAt(0).toUpperCase() + result.slice(1);
}

module.exports = router;
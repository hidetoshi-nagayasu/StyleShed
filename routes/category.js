const express     = require('express');
const router      = express.Router();
const moment      = require('moment');
const connection  = require('../mysql_connection');
const query       = require('../repository/category');
const message     = require('../message_const');

/**
 * カテゴリ画面遷移
 * @method GET
 */
router.get('/', (req, res, next) => {
  if (req.session && req.session.user) {
    res.locals.user = req.session.user;
  }

  res.render('category/category', {});
});

module.exports = router;
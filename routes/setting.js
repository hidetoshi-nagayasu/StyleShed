const express     = require('express');
const router      = express.Router();
const moment      = require('moment');
const connection  = require('../mysql_connection');
const query       = require('../repository/setting');
const message     = require('../message_const');

/**
 * プロフィール編集画面遷移
 * @method GET
 */
router.get('/profile', function(req, res, next) {
  if(req.session && req.session.user) {
    res.locals.user = req.session.user;
    res.render('setting/profile', {});
  } else {
    req.session.url = req.originalUrl; 
    res.redirect('/auth/signin');
  }
});

module.exports = router;
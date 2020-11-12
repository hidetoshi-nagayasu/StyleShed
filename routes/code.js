const express     = require('express');
const router      = express.Router();
const moment      = require('moment');
const connection  = require('../mysql_connection');
const query       = require('../repository/category');
const message     = require('../message_const');

/**
 * コーディング画面遷移
 * @method GET
 */
router.get('/', (req, res, next) => {
  res.render('code/code', { title: 'Code' });
  // if (req.session && req.session.user) {
  //   res.locals.user = req.session.user;
  //   res.render('code/code', { title: 'Code' });
  // } else {
  //   req.session.url = req.originalUrl; 
  //   res.redirect('/auth/signin');
  // }
});

module.exports = router;

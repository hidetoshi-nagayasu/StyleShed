const express = require('express');
const message = require('../message_const');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  if (req.session && req.session.user) {
    res.locals.user = req.session.user;
  }

  res.render('index', {
    flash: req.flash('login_success', message.LOGIN_SUCCESS)
  });
});

module.exports = router;

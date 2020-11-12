const express = require('express');
const router = express.Router();

/**
 * プロフィール遷移
 * @method GET
 */
router.get('/:username', (req, res, next) => {
  if (req.session && req.session.user) {
    res.locals.user = req.session.user;
  }

  const username = req.params.username;
  console.log(username);
  res.render('profile', {
    username: username
  });
});


/**
 * いいね一覧遷移
 * @method GET
 */
router.get('/:username/like', (req, res, next) => {
  if (req.session && req.session.user) {
    res.locals.user = req.session.user;
  }

  const username = req.params.username;
  res.render('profile', {
    username: username
  });
});


/**
 * ストック一覧遷移
 * @method GET
 */
router.get('/:username/stock', (req, res, next) => {
  if (req.session && req.session.user) {
    res.locals.user = req.session.user;
  }

  const username = req.params.username;
  res.render('profile', {
    username: username
  });
});

module.exports = router;

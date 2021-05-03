const express = require('express');
const message = require('../message_const');
const router = express.Router();
const connection = require('../mysql_connection');
const query = require('../repository/contents');
const app_const = require('../app_const');

router.get('/:title', (req, res, next) => {
  if (req.session && req.session.user) {
    res.locals.user = req.session.user;
  }

  const username = req.params.username;

  if(!req.params || !req.params.hasOwnProperty('title')) {
    responseNoContents(res, username);
  }

  let title = req.params.title;

  if(!app_const.SIDEBAR_CATEGORY.hasOwnProperty(title)) {
    responseNoContents(res, username);
  }

  let pageTitle = app_const.SIDEBAR_CATEGORY[title].name;
  let pageDescription = app_const.SIDEBAR_CATEGORY[title].desc;

  res.render('index', {
    username: username,
    category: app_const.SIDEBAR_CATEGORY,
    header_item: {
      page_title: pageTitle,
      page_description: pageDescription
    },
  });
});


/**
 * No Contentsを画面側に返すメソッド
 * @param {*} res 
 * @param {*} username 
 * @returns 
 */
const responseNoContents = (res, username) => {
  return res.render('index', {
    username: username,
    category: app_const.SIDEBAR_CATEGORY,
    header_item: {
      page_title: message.NO_CONTENTS_TITLE,
      page_description: message.NO_CONTENTS_DESC
    }
  });
}


module.exports = router;
const nodemailer = require("nodemailer");
const env = process.env;

//SMTPサーバ基本情報設定
const smtp = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: env.MAIL_USER,
    pass: env.MAIL_PASSWORD
  }
});

module.exports = smtp;
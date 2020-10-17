
const query = {

  // ユーザー名とEmailの存在チェック
  userExists: function() {
    return `SELECT count(user_name = ? OR null) AS username_exists, count(email = ? OR null) AS email_exists FROM user`;
  },

  // ユーザー登録
  registerUser: function() {
    return `INSERT INTO user (user_name, email, password, created_at, updated_at, is_deleted) VALUES (?, ?, ?, ?, ?, 0)`;
  },

  // メールアドレスをもとにユーザー検索
  LoginUser: function() {
    return `SELECT id, user_name, email, password FROM user WHERE email = ? LIMIT 1`;
  },

  updateLastLoginAt: function() {
    return `UPDATE user SET last_login_at = ? WHERE id = ?`;
  },

  // 【パスワード忘れ用】メールアドレスからユーザー検索
  findUserByEmail: function() {
    return `SELECT id, user_name FROM user WHERE email = ? LIMIT 1`;
  },

  // idをもとにURLパラメーター文字列と現在時刻をアップデート
  updatePasswordResetToken: function() {
    return `UPDATE user SET password_reset_token = ?, password_reset_sent_at = ? WHERE id = ?`;
  },

  // tokenが一致するユーザーを取得
  fetchUserMatchToken: function() {
    return `SELECT id, password_reset_sent_at FROM user WHERE password_reset_token = ? LIMIT 1`;
  },

  // パスワードアップデート
  updatePasswordWhenReset: function() {
    return `UPDATE user SET password = ? WHERE user_name = ? AND password_reset_token = ?`;
  },
};

module.exports = query;

const query = {

  // Emailの存在チェック
  emailExists: function(email) {
    return `SELECT * FROM user WHERE email = '${email}' LIMIT 1`;
  },

  // ユーザー登録
  registerUser: function(username, email, hashedPassword, createdAt) {
    return `INSERT INTO user (user_name, email, password, created_at, updated_at, is_deleted) VALUES ('${username}', '${email}', '${hashedPassword}', '${createdAt}', '${createdAt}', 0)`;
  },

  // メールアドレスをもとにユーザー検索
    LoginUser: function(email) {
      return `SELECT id, user_name, email, password FROM user WHERE email = '${email}' LIMIT 1`;
    }
};

module.exports = query;
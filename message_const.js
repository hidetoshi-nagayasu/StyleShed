const message = {

  // Auth
  LOGIN_FAILED: 'メールアドレスもしくはパスワードが一致しませんでした。',
  LOGIN_SUCCESS: 'ログインに成功しました。',
  SIGNUP_SUCCESS: 'アカウント作成が完了しました。',
  SIGNUP_FAILED: 'アカウント作成に失敗しました。',
  SIGNUP_USERNAME_ALREADY_EXISTS: '既に登録されているユーザー名です。',
  SIGNUP_EMAIL_ALREADY_EXISTS: '既に登録されているメールアドレスです。',
  SIGNUP_INVALID_USERNAME: 'ユーザー名は半角英数字と「_」「-」「.」を用いて3〜20文字以内で入力してください。',
  SIGNUP_INVALID_EMAIL: 'メールアドレスは正しい形式で入力してください。',
  SIGNUP_INVALID_PASSWORD: 'パスワードは大文字小文字英数字の組み合わせ8〜20文字で入力してください。',
  PASSWORD_UPDATE_SUCCESS: 'パスワードの更新が完了しました。',

  // Error
  ERROR_NOT_COMPLETED: '処理が正常に完了しませんでした。もう一度お試しください。',

  // Contents
  NO_CONTENTS_TITLE: 'Oops...',
  NO_CONTENTS_DESC: 'Sorry, no contents at this URL.',
};

module.exports = message;
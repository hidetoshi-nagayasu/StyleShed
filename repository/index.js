
const query = {

  // ページタイトル、説明を取得
  categoryQuery: `SELECT id, category_name, description FROM m_category ORDER BY id ASC`

};

module.exports = query;

const query = {

  // ページタイトル、説明を取得
  getPageInfo: `SELECT id, category_name, description FROM m_category WHERE category_name = ? LIMIT 1`

};

module.exports = query;
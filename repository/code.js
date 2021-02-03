const query = {
  updateCodeTitle: function() {
    return `
      UPDATE
        code
      SET
        title = ?,
        updated_by = ?
      WHERE
        unique_id = ?;
    `;
  },
  insertCode: function() {
    return `
      INSERT INTO code
        (user_id, unique_id, title, created_by, updated_by)
      VALUES
        (?, ?, ?, ?, ?);
      `;
  },
  countUniqueId: function() {
    return `
      SELECT count(*)
      FROM code
      WHERE unique_id = ?;
    `;
  },
  getCodeInfo: function() {
    return `
      SELECT *
      FROM code
      WHERE unique_id = ?
      LIMIT 1;
    `;
  }
};

module.exports = query;
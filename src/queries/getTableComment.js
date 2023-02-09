const db = require('../db');

const tableCommentQuery = (dbName, schemaName, tableName) =>
  `select obj_description('${schemaName}.${tableName}'::regclass)`;

module.exports = async function getTableStructure(schemaName, tableName) {
  const query = tableCommentQuery(db.dbName, schemaName, tableName);
  const res = await db.client.query(query);

  return res.rows[0].obj_description || undefined;
};

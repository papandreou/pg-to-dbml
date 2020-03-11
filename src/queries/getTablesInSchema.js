
const db = require('../db')

const tablesInSchemaQuery = schemaName =>
  `select tablename from pg_tables where schemaname='${schemaName}'`;

module.exports = async function getTablesInSchema(schemaName) {
  const schemaNameQuery = tablesInSchemaQuery(schemaName);
  const res = await db.client.query(schemaNameQuery);
  return res.rows.map(row => row.tablename)
}


const db = require('../db')

const getQuery = (schemaName, whereClause) =>
  `select tablename from pg_tables pt where pt.schemaname='${schemaName}' ${whereClause};`;

const getWhereClause = (skipTables) => {
  if (!skipTables || skipTables.length === 0) return '';

  const tablesToSkip = [
    ...(skipTables ? skipTables : [])
  ];
  const whereConditions = tablesToSkip.reduce((acc, skipThisTable, idx, arr) => {
    const addAnd = (idx === (arr.length - 1)) ? '' : 'AND';
    return `${acc}pt.tablename NOT LIKE '${skipThisTable}' ${addAnd} `;
  }, ' AND ');

  return `${whereConditions}`;
};

module.exports = async function getTablesInSchema(schemaName, skipTables) {
  const whereClause = getWhereClause(skipTables);
  const queryGetTablesInSchema = getQuery(schemaName, whereClause);
  // console.log(`tables query for schema ${schemaName}: ${queryGetTablesInSchema}`);
  const res = await db.client.query(queryGetTablesInSchema);
  return res.rows.map(row => row.tablename).sort();
}

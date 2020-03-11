
const db = require('../db')

const tablesInSchemaQuery = schemaName =>
  `select tablename from pg_tables where schemaname='${schemaName}'`;

module.exports = async function getTablesInSchema(schemaName) {
  const schemaNameQuery = tablesInSchemaQuery(schemaName);
  const res = await db.client.query(schemaNameQuery);
  return res.rows.map(row => row.tablename)

  // const allPromises = schemas.map(schema => {
  //   const { nspname: schemaName } = schema;
  //   const schemaNameQuery = tablesInSchemaQuery(schemaName);

  // });


  //  console.dir(tables);
  // , (err, res) => {
  //   if (err) process.exit(err);
  //   const tableNameArr = res.rows.map(row => row.tablename);
  //   getTableColumnInfo(tableNameArr, schemaName, fileName);
  // }

  // getTableColumnInfo(tableNameArr, schemaName, fileName);



}

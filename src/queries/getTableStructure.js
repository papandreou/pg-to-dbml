const db = require('../db')

const tableColumnInfoQuery = (dbName, tableName) => `select cols.column_name, 
         cols.column_default, 
         cols.is_nullable, 
         cols.data_type, 
         cols.udt_name, 
         cols.character_maximum_length, 
         cols.datetime_precision,
         (select MAX(pg_catalog.col_description(oid,cols.ordinal_position::int)) from pg_catalog.pg_class c where c.relname=cols.table_name) as column_comment
  from information_schema.columns cols
  where cols.table_catalog='${dbName}' and cols.table_name='${tableName}'`;

module.exports = async function getTableStructure(tableName) {
  const query = tableColumnInfoQuery(db.dbName, tableName);
  // console.log(`query: ${query}`)
  const res = await db.client.query(query);
  return res.rows;
}


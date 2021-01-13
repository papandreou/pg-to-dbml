const db = require('../db');

const tableColumnInfoQuery = (dbName, schemaName, tableName) => `select cols.column_name, 
         cols.column_default, 
         cols.is_nullable, 
         cols.data_type, 
         cols.udt_name, 
         cols.character_maximum_length, 
         cols.datetime_precision,
         (select MAX(pg_catalog.col_description(oid,cols.ordinal_position::int)) from pg_catalog.pg_class c where c.relname=cols.table_name) as column_comment,
         cols.ordinal_position
  from information_schema.columns cols
  where cols.table_catalog='${dbName}' and cols.table_schema='${schemaName}' and cols.table_name='${tableName}'
  order by cols.ordinal_position`;

module.exports = async function getTableStructure(schemaName, tableName) {
  const query = tableColumnInfoQuery(db.dbName, schemaName, tableName);
  const res = await db.client.query(query);

  return res.rows;
};

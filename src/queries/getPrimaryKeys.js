const db = require('../db')

const getQuery = (dbName, schemaName, tableName) => `SELECT 
tc.constraint_schema ,
tc.constraint_name ,
tc.table_schema ,
tc.table_name,
tc.constraint_type,
kcu.column_name,
kcu.table_name 
FROM information_schema.table_constraints tc 
  LEFT JOIN information_schema.key_column_usage kcu ON (kcu.constraint_schema = tc.constraint_schema AND kcu.table_name = tc.table_name AND kcu.constraint_name = tc.constraint_name)
WHERE tc.constraint_catalog ='${dbName}' AND tc.table_schema ='${schemaName}'  AND tc.table_name = '${tableName}'
  AND tc.constraint_type = 'PRIMARY KEY';`;

// where cols.table_catalog = '${dbName}' and cols.table_schema = '${schemaName}' and cols.table_name = '${tableName}'
// order by cols.ordinal_position`;

module.exports = async function getPrimaryKeys(schemaName, tableName) {
  const query = getQuery(db.dbName, schemaName, tableName);
  console.log(`query: ${query} `)
  const res = await db.client.query(query);
  return res.rows;
}


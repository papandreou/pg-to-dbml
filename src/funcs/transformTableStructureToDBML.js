const { EOL } = require('os');
const getColumnDefinition = require('./getColumnDefinition');

module.exports = function transformTableStructureToDBML(
  { tableName, primaryKeys, structure: colDefs, comment },
  schemaName,
  includeSchemaName
) {
  const columns = colDefs && Array.isArray(colDefs) ? colDefs : [];
  const columnDefinitions = columns.map(column => getColumnDefinition(column, primaryKeys));
  const tableNameString = includeSchemaName ? `"${schemaName}"."${tableName}"` : `"${tableName}"`;
  columnDefinitions.unshift(`Table ${tableNameString} {`);
  if (comment) {
    columnDefinitions.push('', `  note: '${comment.replace(/'/g, "\\'")}'`);
  }

  columnDefinitions.push(`} ${EOL} ${EOL} `);

  return columnDefinitions.join(`${EOL} `);
};

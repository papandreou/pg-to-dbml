const { EOL } = require('os');
const getColumnDefinition = require('./getColumnDefinition');

module.exports = function transformTableStructureToDBML(
  { tableName, primaryKeys, structure: colDefs },
  schemaName,
  includeSchemaName
) {
  const columns = colDefs && Array.isArray(colDefs) ? colDefs : [];
  const columnDefinitions = columns.map(column => getColumnDefinition(column, primaryKeys));
  const tableNameString = includeSchemaName ? `${schemaName}."${tableName}"` : `"${tableName}"`;
  columnDefinitions.unshift(`Table ${tableNameString} {`);
  columnDefinitions.push(`} ${EOL} ${EOL} `);

  return columnDefinitions.join(`${EOL} `);
};

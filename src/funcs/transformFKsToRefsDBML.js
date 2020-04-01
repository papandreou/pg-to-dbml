'use strict';

const { EOL } = require('os');

const getColumnGetter = tables => (tableName, ordinalPosition) => tables
  .filter(table => table.tableName === tableName)
  .map(({ structure }) => {
    return structure.find(column => column.ordinal_position === ordinalPosition);
  })[0];


module.exports = function transformFKsToRefsDBML(schemaName, tables, constraints, ) {
  const getColumn = getColumnGetter(tables);
  // NOTE: only handling in-schema relationships... not FKs to other schemas
  //       because DBML does not yet handle that situation
  return constraints
    .filter(constraint => constraint.constraintType === 'FOREIGN KEY' && constraint.toSchema === schemaName)
    .map(({ fromTable, fromColumns, toTable, toColumns }) => {
      const foreignKey = getColumn(fromTable, fromColumns[0])
      const foreignRelation = getColumn(fromTable, toColumns[0])
      return `${EOL}Ref: ${fromTable}.${foreignKey.column_name} > ${toTable}.${foreignRelation.column_name}`
    })
    .join(``);
};
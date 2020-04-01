'use strict';

const { EOL } = require('os');

module.exports = function transformFKsToRefsDBML(schemaName, tables, constraints, includeSchemaName, columnGetter) {
  // NOTE: only handling in-schema relationships... not FKs to other schemas
  //       because DBML does not yet handle that situation
  const dbml = constraints
    .filter(constraint => constraint.constraintType === 'FOREIGN KEY' && (includeSchemaName ? true : constraint.toSchema === schemaName))
    .map(({ fromSchema, fromTable, fromColumns, toSchema, toTable, toColumns }) => {
      const foreignKey = columnGetter(fromSchema, fromTable, fromColumns[0])
      const foreignRelation = columnGetter(toSchema, toTable, toColumns[0])

      const fromString = includeSchemaName ? `${fromSchema}.${fromTable}` : fromTable;
      const toString = includeSchemaName ? `${toSchema}.${toTable}` : toTable;

      return `${EOL}Ref: "${fromString}".${foreignKey.column_name} > "${toString}".${foreignRelation.column_name}`
    })
    .join(``);

  return `${dbml} ${EOL} ${EOL}`
};
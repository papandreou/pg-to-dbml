'use strict';

const { EOL } = require('os');

module.exports = function transformFKsToRefsDBML(schemaName, constraints, includeSchemaName, columnGetter) {
  // NOTE: only handling in-schema relationships... not FKs to other schemas
  //       because DBML does not yet handle that situation
  const dbml = constraints
    .filter(constraint => constraint.constraintType === 'FOREIGN KEY' && (includeSchemaName ? true : constraint.toSchema === schemaName))
    .map(({ fromSchema, fromTable, fromColumns, toSchema, toTable, toColumns }) => {
      const cleanFromTable = fromTable.replace(/"/g, '');
      const cleanToTable = toTable.replace(/"/g, '');
      const foreignKey = columnGetter(fromSchema, cleanFromTable, fromColumns[0])
      const foreignRelation = columnGetter(toSchema, cleanToTable, toColumns[0])

      if (typeof foreignKey === "undefined") {
        console.log('foreignKey is undefined!');
      }

      if (typeof foreignRelation === "undefined") {
        console.log('foreignRelation is undefined!');
      }

      const fromString = includeSchemaName ? `${fromSchema}.${cleanFromTable}` : cleanFromTable;
      const toString = includeSchemaName ? `${toSchema}.${cleanToTable}` : cleanToTable;

      return `${EOL}Ref: "${fromString}".${foreignKey.column_name} > "${toString}".${foreignRelation.column_name}`
    })
    .join(``);

  return `${dbml} ${EOL} ${EOL}`
};
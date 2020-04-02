'use strict';

const { EOL } = require('os');

<<<<<<< HEAD
module.exports = function transformFKsToRefsDBML(schemaName, constraints, includeSchemaName, columnGetter) {
=======
module.exports = function transformFKsToRefsDBML(schemaName, tables, constraints, includeSchemaName, columnGetter) {
>>>>>>> a01a00aab0de9eccd583ee113f844baca83d8b2c
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
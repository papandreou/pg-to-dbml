const db = require('../db');

const getQuery = schemaName => `
  SELECT conrelid::regclass AS from_schema_table,
    conname AS constraint_name,
    conkey AS table_from_constraint_columns,
    pg_get_constraintdef(oid) AS constraint_definition,
    confrelid::regclass AS to_schema_table,
    confkey AS table_to_contstraint_columns,
    connamespace
  FROM   pg_constraint pgc
  WHERE  contype IN ('f', 'p', 'u')
  AND    connamespace = (SELECT pn2.oid FROM pg_catalog.pg_namespace pn2 WHERE pn2.nspname = '${schemaName}')
  ORDER  BY conrelid::regclass::text, contype DESC;`;

const getConstraintType = constraintDefinition => {
  if (constraintDefinition.startsWith('PRIMARY KEY')) return 'PRIMARY KEY';
  if (constraintDefinition.startsWith('FOREIGN KEY')) return 'FOREIGN KEY';
  if (constraintDefinition.startsWith('UNIQUE')) return 'UNIQUE';

  return constraintDefinition;
};

module.exports = async function getConstraints(schemaName) {
  const query = getQuery(schemaName);
  const res = await db.client.query(query);

  return res.rows.map(
    ({
      constraint_definition: constraintDefinition,
      constraint_name: constraintName,
      from_schema_table: fromSchemaTable,
      to_schema_table: toSchemaTable,
      table_from_constraint_columns: fromColumns,
      table_to_contstraint_columns: toColumns
    }) => {
      const [fromSchema, fromTable] = fromSchemaTable.split('.');
      const [toSchema, toTable] = toSchemaTable === '-' ? [] : toSchemaTable.split('.');

      return {
        constraintDefinition,
        constraintName,
        constraintType: getConstraintType(constraintDefinition),
        fromColumns,
        fromSchema,
        fromTable,
        toColumns,
        toSchema,
        toTable
      };
    }
  );
};

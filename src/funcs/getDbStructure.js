'use strict';

const getSchemas = require('../queries/getSchemas');
const getTablesInSchema = require('../queries/getTablesInSchema');
const getTableStructure = require('../queries/getTableStructure');
const getConstraints = require('../queries/getConstraints');

const getPrimaryKey = (schema, tableName, constraints) => {
  if (!constraints) return undefined;
  return constraints.find(({ constraintType, fromSchema, fromTable }) => {
    return fromSchema === schema &&
      fromTable === tableName &&
      constraintType === "PRIMARY KEY";
  });
}

/**
 * @function getDbStructure
 * @returns {array[object]} of all schemas of shape
 * [
 *   {  
 *     schema: 'public',
 *     tables: [
 *       {
 *          tableName: 'users'
 *          structure: [ ... ] // of pg column definitions
 *       }
 *     ]
 *   }
 * ]
 */
module.exports = async function getDbStructure(schemaName, skipSchemas, skipTables) {
  if (skipSchemas && skipSchemas.length > 0) console.log(`will skip schemas ${skipSchemas.join(', ')}`);
  const schemasInUse = await getSchemas(schemaName, skipSchemas);

  if (!schemasInUse || schemasInUse.length === 0) return undefined;

  const getAllTables = schemasInUse.map(async schema => {
    console.log(`found schema "${schema}"`);
    const tables = await getTablesInSchema(schema, skipTables);
    const constraints = await getConstraints(schema);
    return {
      constraints,
      schema,
      tables
    };
  });

  const allTables = await Promise.all(getAllTables);

  const getAllColumnDefs = allTables.map(async ({ constraints, schema, tables }) => {
    const getAllTableColumns = tables.map(async tableName => {
      const structure = await getTableStructure(schema, tableName);
      const primaryKey = getPrimaryKey(schema, tableName, constraints);
      const structureWithConstraints = structure.map(column => {
        const isPrimary = primaryKey && primaryKey.fromColumns.includes(column.ordinal_position);
        return {
          ...column,
          isPrimary
        }
      });
      return {
        tableName,
        structure: structureWithConstraints
      };
    });

    console.log(`getting structure of schema "${schema}"`);
    const allTableStructures = await Promise.all(getAllTableColumns);
    return {
      constraints,
      schema,
      tables: allTableStructures
    }
  });

  return Promise.all(getAllColumnDefs);
};
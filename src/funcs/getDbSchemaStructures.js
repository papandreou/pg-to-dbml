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
      constraintType === 'PRIMARY KEY';
  });
}

/**
 * @function getDbSchemaStructures
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

async function getAllTables(schemas, skipTables) {
  const allTablesPromises = schemas.map(async schema => {
<<<<<<< HEAD:src/funcs/getDbSchemaStructures.js
=======
    console.log(`found schema "${schema}"`);
>>>>>>> a01a00aab0de9eccd583ee113f844baca83d8b2c:src/funcs/getDbStructure.js
    const tables = await getTablesInSchema(schema, skipTables);
    const constraints = await getConstraints(schema);
    return {
      constraints,
      schema,
      tables
    };
  });

  return Promise.all(allTablesPromises);
}

async function getTableStructuresForSchema({ schema, tables, constraints }) {
  const promises = tables.map(async tableName => {
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

  return Promise.all(promises);
}

module.exports = async function getDbSchemaStructures(argv) {
  const { s: includeSchemas, S: skipSchemas, T: skipTables } = argv;

  if (skipSchemas && skipSchemas.length > 0) console.log(`will skip schemas ${skipSchemas.join(', ')}`);
  const schemas = await getSchemas(includeSchemas, skipSchemas);

  if (!schemas || schemas.length === 0) return undefined;

  const allTables = await getAllTables(schemas, skipTables);
  const getAllColumnDefs = allTables.map(async ({ constraints, schema, tables }) => {
    const allTableStructures = await getTableStructuresForSchema({ constraints, schema, tables })
    return {
      constraints,
      schema,
      tables: allTableStructures
    }
  });

  return Promise.all(getAllColumnDefs);
};
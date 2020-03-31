'use strict';

const getSchemas = require('../queries/getSchemas');
const getTablesInSchema = require('../queries/getTablesInSchema');
const getTableStructure = require('../queries/getTableStructure');

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
    return {
      schema,
      tables
    };
  });

  const allTables = await Promise.all(getAllTables);

  const getAllColumnDefs = allTables.map(async ({ schema, tables }) => {
    const getAllTableColumns = tables.map(async tableName => {
      const structure = await getTableStructure(tableName);
      return {
        tableName,
        structure
      };
    });

    console.log(`getting structure of schema "${schema}"`);
    const allTableStructures = await Promise.all(getAllTableColumns);
    return {
      schema,
      tables: allTableStructures
    }
  });

  return Promise.all(getAllColumnDefs);
};
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
module.exports = async function getDbStructure() {
  const schemasInUse = await getSchemas();

  const getAllTables = schemasInUse.map(async schema => {
    console.log(`found schema "${schema}"`);
    const tables = await getTablesInSchema(schema);
    return {
      schema,
      tables
    };
  });

  const results = await Promise.all(getAllTables);

  const getAllColumnDefs = results.map(async ({ schema, tables }) => {
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
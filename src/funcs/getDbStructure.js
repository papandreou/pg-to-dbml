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
  //console.dir(schemasInUse);

  // TODO: switch out Promise.all() for package `p-map` ? 
  // should be faster, allows for concurrency
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
    const allstructures = await Promise.all(getAllTableColumns);
    return {
      schema,
      tables: allstructures
    }
  });

  return Promise.all(getAllColumnDefs);
};
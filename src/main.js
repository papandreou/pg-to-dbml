
const db = require('./db');

const getSchemas = require('./queries/getSchemas');
const getTablesInSchema = require('./queries/getTablesInSchema');
const getTableStructure = require('./queries/getTableStructure');

const transformToDbml = require('./transformToDbml');
const createFile = require('./utils/createFile');
const writeToFile = require('./utils/writeToFile');

const argv = require('yargs')
  .usage('Usage: $0 [options]')
  .usage('Usage: $0 [options]')
  .alias('o', 'output_path')
  .nargs('o', 1)
  .describe('o', 'where you want the dbml files to be outputted.')
  .default('o', './')
  .alias('c', 'connection_string')
  .nargs('c', 1)
  .describe('c', 'database connection string for the db you want to output dbml file(s).')
  .alias('db', 'db_name')
  .nargs('db', 1)
  .describe('db', 'database name you want to create dbml file(s) from.')
  .alias('t', 'timeout')
  .nargs('t', 1)
  .describe('t', 'how long you want process to run (in milliseconds) before it exits process.')
  .default('t', 5000)
  .demandOption(['c', 'db'])
  .argv;

const { c: dbConnectionString, db: dbName, o: outputDir, t: timeout } = argv;

/*

TODO: check if output dir exists... 
TODO: add timeout back...
TODO; improve error handling... just a bit
TODO: add option for logging, e.g. how verbose

*/

async function main() {
  try {
    await db.initialize({ dbConnectionString, dbName });
    const schemasInUse = await getSchemas();
    console.dir(schemasInUse);

    const getTablesPromises = schemasInUse.map(async schema => {
      console.log(`found schema "${schema}"`);
      const tables = await getTablesInSchema(schema);
      return {
        schema,
        tables
      };
    });

    const results = await Promise.all(getTablesPromises);

    const allPromises = results.map(async ({ schema, tables }) => {
      const allStructuresPromises = tables.map(async tableName => {
        const structure = await getTableStructure(tableName);
        return {
          tableName,
          structure
        };
      });

      console.log(`getting structure of schema "${schema}"`);
      const allstructures = await Promise.all(allStructuresPromises);
      return {
        schema,
        tables: allstructures
      }
    });

    const allResults = await Promise.all(allPromises);
    allResults.forEach(({ schema, tables }) => {
      if (schema !== 'polaris') {
        return;
      }
      const dir = outputDir || './';
      const fileName = `${dir}/${schema}.dbml`
      console.log(`output for ${schema} to ${fileName}`);
      createFile(fileName);
      tables.forEach(({ tableName, structure }) => {
        const dbml = transformToDbml(tableName, structure);
        writeToFile(fileName, dbml);
      })
    })

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();

process.on('exit', (code) => {
  return console.log(code);
})
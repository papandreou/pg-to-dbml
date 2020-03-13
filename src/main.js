
const db = require('./db');

const getDbStructure = require('./funcs/getDbStructure');
const writeResults = require('./funcs/writeResults');

const argv = require('yargs')
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

async function main() {
  const { c: dbConnectionString, db: dbName } = argv;

  try {
    await db.initialize({ dbConnectionString, dbName });
    const dbStructure = await getDbStructure();
    writeResults(dbStructure);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();

process.on('exit', (code) => {
  if (code === 0) {
    console.log('process executed successfully.')
  } else {
    console.log('process exited unsuccessfully...')
  }
})
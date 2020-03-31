'use strict';

const db = require('../db');
const getDbStructure = require('../funcs/getDbStructure');
const writeResults = require('../funcs/writeResults');

async function toDbml(argv) {
  const { c: dbConnectionString, db: dbName, s: schemaName, S: skipSchemas, T: skipTables } = argv;

  try {
    await db.initialize({ dbConnectionString, dbName });
    const dbStructure = await getDbStructure(schemaName, skipSchemas, skipTables);
    if (!dbStructure) {
      console.log('no schemas found!');
    } else {
      writeResults(dbStructure);
    }
    console.log(`to-dbml finished.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

module.exports = toDbml;

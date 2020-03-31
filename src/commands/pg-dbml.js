'use strict';

const db = require('../db');
const getDbStructure = require('../funcs/getDbStructure');
const writeResults = require('../funcs/writeResults');

async function pgToDbmlDirect(argv) {
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

module.exports = pgToDbmlDirect;

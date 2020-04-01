'use strict';

const db = require('../db');
const getDbSchemaStructures = require('../funcs/getDbSchemaStructures');
const writeResults = require('../funcs/writeResults');

async function toDbml(argv) {
  const { c: dbConnectionString, db: dbName } = argv;

  try {
    await db.initialize({ dbConnectionString, dbName });
    const schemaStructures = await getDbSchemaStructures(argv);
    if (!schemaStructures) {
      console.log('no schemas found!');
    } else {
      writeResults(schemaStructures);
    }
    console.log(`to-dbml finished.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

module.exports = toDbml;

'use strict';

const { exec } = require('child_process');
const { readFileSync } = require('fs');
const createFile = require('../utils/createFile');
const writeToFile = require('../utils/writeToFile');

const { importer } = require('@dbml/core');

const execPromise = async (command) => new Promise((resolve, reject) => {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      reject(error);
      return;
    }
    console.log(`execPromise ${command} is complete`);
    resolve();
    // if (stdout) resolve(stdout);
    // if (stderr) resolve(stderr);
  });
});

async function checkForBin(nameOfExecutable) {
  // will work for linux like systems with `which` command
  try {
    await execPromise(`which ${nameOfExecutable}`);
    console.log(`${nameOfExecutable} found!`);
  } catch (ex) {
    console.log(`${nameOfExecutable} not found.`);
    console.log(`${nameOfExecutable} is required to run this command.\nPlease find and install.`);
    process.exit(1);
  }
}

async function execPgDump({
  dbConnectionString,
  dbName,
  outputFileName,
  schemaName
}) {
  // for pg_dump, see https://www.postgresql.org/docs/12/app-pgdump.html
  // NOTE: -T is set to skip tables name databasechange* as they ORM controlled tables not related to our data modelf
  const schemaString = schemaName ? `-n ${schemaName}` : '';
  const command = `pg_dump ${dbConnectionString}/${dbName} -O -s -T 'databasechange*' -N 'wip' -N 'audit_*' ${schemaString} > ${outputFileName}.sql`
  return execPromise(command);
}

function createDBML(outputFileName) {
  const postgreSQL = readFileSync(`${outputFileName}.sql`, 'utf-8');
  // generate DBML from PostgreSQL script
  let dbml;
  try {
    dbml = importer.import(postgreSQL, 'postgres');
    return dbml;
  } catch (ex) {
    console.error(ex);
    console.log('you are here');
    throw ex;

  }

}

function dumpDBMLToFile({
  dbml,
  outputFileName,
  outputPath: dir
}) {
  const fileName = `${dir}/${outputFileName}.dbml`
  console.log(`creating file ${fileName}`);
  createFile(fileName);
  writeToFile(fileName, dbml);
  console.log(`completed writing to file ${fileName}`);
}

const getOutputFileName = ({ dbName, schemaName }) => `${schemaName ? schemaName : dbName}`;

async function pgDumpToDBML(argv) {
  const { c: dbConnectionString, db: dbName, o: outputPath, s: schemaName } = argv;

  try {
    const outputFileName = getOutputFileName({ dbName, schemaName });

    await checkForBin('pg_dump');
    console.log('hello world')
    // await execPgDump({
    //   dbConnectionString,
    //   dbName,
    //   outputFileName,
    //   schemaName
    // });
    console.log('thou art hence');
    const dbml = createDBML(outputFileName);
    dumpDBMLToFile({ dbml, outputFileName, outputPath })
    console.log(`...done`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

module.exports = pgDumpToDBML;

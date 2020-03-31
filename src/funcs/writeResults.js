const yargs = require('yargs')

const transformToDbml = require('./transformToDbml');
const createFile = require('../utils/createFile');
const writeToFile = require('../utils/writeToFile');

module.exports = allResults => {
  const { o: outputDir } = yargs.argv;

  return allResults.forEach(({ schema, tables }) => {
    const dir = outputDir || './';
    const fileName = `${dir}/${schema}.dbml`
    createFile(fileName);
    console.log(`dumping schema ${schema} structure to ${fileName}`);
    tables.forEach(({ tableName, structure }) => {
      const dbml = transformToDbml(tableName, structure);
      writeToFile(fileName, dbml);
    })
  });
}
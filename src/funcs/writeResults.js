const yargs = require('yargs')

const transformToDbml = require('./transformToDbml');
const createFile = require('../utils/createFile');
const writeToFile = require('../utils/writeToFile');

module.exports = allResults => {
  const { o: outputDir } = yargs.argv;

  return allResults.forEach(({ schema, tables }) => {
    // TODO: add ability to specificy a schema!
    // if (schema !== 'polaris') {
    //   return;
    // }
    const dir = outputDir || './';
    const fileName = `${dir}/${schema}.dbml`

    //console.log(`output for ${schema} to ${fileName}`);

    createFile(fileName);
    tables.forEach(({ tableName, structure }) => {
      const dbml = transformToDbml(tableName, structure);
      writeToFile(fileName, dbml);
    })
  });
}
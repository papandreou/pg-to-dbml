const yargs = require('yargs')

const transformTableStructureToDBML = require('./transformTableStructureToDBML');
const transformFKsToRefsDBML = require('./transformFKsToRefsDBML');

const createFile = require('../utils/createFile');
const writeToFile = require('../utils/writeToFile');

module.exports = allResults => {
  const { o: outputDir } = yargs.argv;

  return allResults.forEach(({ constraints, schema, tables }) => {
    const dir = outputDir || './';
    const fileName = `${dir}/${schema}.dbml`
    createFile(fileName);
    console.log(`dumping schema ${schema} structure to ${fileName}`);
    tables.forEach((tableDefinition) => {
      const dbml = transformTableStructureToDBML(tableDefinition);
      writeToFile(fileName, dbml);
    })
    const relationsDbml = transformFKsToRefsDBML(schema, tables, constraints);
    writeToFile(fileName, relationsDbml);
  });
}
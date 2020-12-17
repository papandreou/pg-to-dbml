const { appendFileSync } = require('fs');

module.exports = (fileName, fileContents) => {
  // outputDir && console.log(`creating/adding to: ${schemaName}.dbml to your output path with the dbml definition of table ${tableName}.`)
  // : console.log(returnValue);
  appendFileSync(fileName, fileContents, 'utf8', () => { });
}

const { appendFileSync } = require('fs');

module.exports = (fileName, fileContents) =>
  appendFileSync(fileName, fileContents, 'utf8', () => {});

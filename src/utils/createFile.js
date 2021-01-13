const { constants, existsSync, writeFileSync } = require('fs');

module.exports = fileName => {
  if (existsSync(fileName, constants.R_OK | constants.W_OK)) {
    writeFileSync(fileName, '', () => {});
  }
};

const { constants, existsSync, writeFileSync } = require('fs');

module.exports = fileName => {
  // eslint-disable-next-line no-bitwise
  if (existsSync(fileName, constants.R_OK | constants.W_OK)) {
    writeFileSync(fileName, '');
  }
};

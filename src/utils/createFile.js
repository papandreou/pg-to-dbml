const { constants, fs } = require('fs');

module.exports = (fileName) => {
  if (fs.existsSync(fileName, constants.R_OK | constants.W_OK)) {
    fs.writeFileSync(fileName, '', () => { });
  }
}

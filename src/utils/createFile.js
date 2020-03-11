const fs = require('fs');

module.exports = (fileName) => {
  if (fs.existsSync(fileName, fs.constants.R_OK | fs.constants.W_OK)) {
    fs.writeFileSync(fileName, '', () => { });
  }
}

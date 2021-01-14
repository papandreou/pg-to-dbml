const getColumnType = require('./getColumnType');
const getColumnSettings = require('./getColumnSettings');

module.exports = function getColumnDefinition(col) {
  const { character_maximum_length: charMaxLength, column_name: columnName } = col;

  const dataType = getColumnType(col);
  const characterMaxLength = charMaxLength ? `(${charMaxLength})` : ' ';
  const columnSettings = getColumnSettings({ ...col, dataType });

  return `\t"${columnName}" ${dataType}${characterMaxLength} ${columnSettings} `;
};

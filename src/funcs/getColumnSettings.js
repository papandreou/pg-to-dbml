const getColumnDefault = require('./getColumnDefault.js');

// NOTE: see https://www.dbml.org/docs/#project-definition
module.exports = function getColumnSettings(col) {
  const {
    column_comment: columnComment,
    column_default: columnDefault,
    is_nullable: isNullable,
    dataType,
    isPrimary
  } = col;

  const columnSettings = [];

  const primaryKeySetting = isPrimary && `primary key`;
  if (primaryKeySetting) columnSettings.unshift(primaryKeySetting);

  const defaultSetting = getColumnDefault(columnDefault, dataType);
  if (defaultSetting) columnSettings.unshift(defaultSetting);

  const notNullSetting = !isNullable && 'not null';
  if (notNullSetting) columnSettings.unshift(notNullSetting);

  const note = columnComment && `note: '${columnComment}'`;
  if (note) columnSettings.unshift(note);


  return columnSettings.length > 0 ? `[${columnSettings.join(', ')}]` : '';
};
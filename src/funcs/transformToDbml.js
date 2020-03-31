const { EOL } = require('os');

// NOTE: possible to use https://www.dbml.org/js-module/#api for the transform to dbml?
const getColumnType = (col) => {
  const { data_type: dataType } = col;
  let columnType;
  switch (dataType) {
    case 'character varying':
      columnType = 'varchar';
      break;
    case 'timestamp':
    case 'timestamp with time zone':
    case 'timestamp without time zone':
      columnType = 'timestamp';
      break;
    default:
      columnType = dataType;
  }
  return columnType;
}

// NOTE: see https://www.dbml.org/docs/#project-definition
const getColumnSettings = (col) => {
  const {
    column_comment: columnComment,
    column_default: columnDefault,
    is_nullable: isNullable
  } = col;

  const columnSettings = [];

  const cleanUpColumnDefault = columnDefault && columnDefault.includes('::text')
    ? columnDefault.replace(/::text/gi, '').replace(/'/gi, '')
    : columnDefault;

  const defaultSetting = cleanUpColumnDefault
    && `default:'${cleanUpColumnDefault}'`;
  if (defaultSetting) columnSettings.unshift(defaultSetting);

  const note = columnComment && `note:'${columnComment}'`;
  if (note) columnSettings.unshift(note);

  const notNullSetting = !isNullable && 'not null';
  if (notNullSetting) columnSettings.unshift(notNullSetting);

  return columnSettings.length > 0 ? `[${columnSettings.join(', ')}]` : '';
}

const getColumnDefinition = (col) => {
  const {
    character_maximum_length: charMaxLength,
    column_name: columnName
  } = col;

  const dataType = getColumnType(col);

  const characterMaxLength = charMaxLength
    ? `(${charMaxLength})`
    : ' ';
  const columnSettings = getColumnSettings(col);

  return `\t"${columnName}" ${dataType} ${characterMaxLength} ${columnSettings} `;
}

module.exports = function writeToDBML({ tableName, primaryKeys, structure: colDefs }) {
  const columns = colDefs && Array.isArray(colDefs) ? colDefs : [];
  const columnDefinitions = columns.map(column => getColumnDefinition(column, primaryKeys));
  columnDefinitions.unshift(`Table "${tableName}" {`);
  columnDefinitions.push(`} ${EOL} ${EOL} `);
  return columnDefinitions.join(`${EOL} `);
}
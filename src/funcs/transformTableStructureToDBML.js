const { EOL } = require('os');

// NOTE: possible to use https://www.dbml.org/js-module/#api for the transform to dbml?
const getColumnType = (col) => {
  const { data_type: dataType } = col;
  let columnType;
  switch (dataType) {
    case 'character varying':
    case 'varchar':
      columnType = 'varchar';
      break;
    case 'double precision':
      columnType = 'number';
      break;
    case 'timestamp':
    case 'timestamp with time zone':
    case 'timestamp without time zone':
    case 'time without time zone':
      columnType = 'timestamp';
      break;
    default:
      columnType = dataType;
  }
  return columnType;
}


const getColumnDefault = (columnDefault, dataType) => {
  if (!columnDefault || columnDefault.includes('::')) return '';
  const isFuncRegEx = /\(/;
  const isFunc = isFuncRegEx.test(columnDefault);

  if (isFunc) {
    return `default: \`${columnDefault}\``;
  } else {
    const useQuotes = ['varchar', 'character', 'char', 'text', 'timestamp'].findIndex(type => type === dataType) > -1;
    return useQuotes ? `default: '${columnDefault}'` : `default: ${columnDefault}`;
  }
}


// NOTE: see https://www.dbml.org/docs/#project-definition
const getColumnSettings = (col) => {
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

  const note = columnComment && `note:'${columnComment}'`;
  if (note) columnSettings.unshift(note);


  return columnSettings.length > 0 ? `[${columnSettings.join(', ')}]` : '';
}

const getColumnDefinition = (col) => {
  const {
    character_maximum_length: charMaxLength,
    column_name: columnName
  } = col;

  const dataType = getColumnType(col);
  const characterMaxLength = charMaxLength ? `(${charMaxLength})` : ' ';
  const columnSettings = getColumnSettings({ ...col, dataType });

  return `\t"${columnName}" ${dataType}${characterMaxLength} ${columnSettings} `;
}

module.exports = function transformTableStructureToDBML({ tableName, primaryKeys, structure: colDefs }, schemaName, includeSchemaName) {
  const columns = colDefs && Array.isArray(colDefs) ? colDefs : [];
  const columnDefinitions = columns.map(column => getColumnDefinition(column, primaryKeys));
  const tableNameString = includeSchemaName ? `${schemaName}.${tableName}` : tableName;
  columnDefinitions.unshift(`Table "${tableNameString}" {`);
  columnDefinitions.push(`} ${EOL} ${EOL} `);
  return columnDefinitions.join(`${EOL} `);
}
const { EOL } = require('os');

// TODO: possible to use https://www.dbml.org/js-module/#api for the transform to dbml?

const getDataType = ({ data_type, udt_name }) => {
  const characterVarying = data_type === 'character varying' ? udt_name : null;
  const timeStamp = data_type === 'timestamp with time zone' ? 'timestamp' : null;
  return characterVarying || timeStamp || data_type;
}

module.exports = function writeToDBML(tableName, tableColumnDefinitions) {

  const columns = tableColumnDefinitions && Array.isArray(tableColumnDefinitions) ? tableColumnDefinitions : [];
  const dbmlColumnDefinitions = columns.map(col => {
    const dataType = getDataType(col);

    // TODO: abstract parsing to very short fns above
    const characterMaxLength = col.character_maximum_length
      ? `(${col.character_maximum_length}) `
      : ' ';
    const nullable = col.is_nullable ? '' : 'not null, ';
    const cleanUpColumnDefault = col.column_default && col.column_default.includes('::text')
      ? col.column_default.replace(/::text/gi, '').replace(/'/gi, '')
      : col.column_default;
    const columnDefault = cleanUpColumnDefault
      ? `default:'${cleanUpColumnDefault}'${nullable ? ', ' : ''}`
      : '';
    const note = col.column_comment ? `note:'${col.column_comment}'` : '';
    const squareBrackets =
      nullable || columnDefault || note ? `[${nullable}${columnDefault}${note}]` : '';

    return `\t${col.column_name} ${dataType}${characterMaxLength}${squareBrackets}`;
  });

  dbmlColumnDefinitions.unshift(`Table ${tableName} {`);
  dbmlColumnDefinitions.push(`}${EOL}${EOL}`);
  return dbmlColumnDefinitions.join(`${EOL}`);
}
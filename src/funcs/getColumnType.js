// NOTE: possible to use https://www.dbml.org/js-module/#api for the transform to dbml?
module.exports = function getColumnType(col) {
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
};
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

module.exports = { getColumnDefault }
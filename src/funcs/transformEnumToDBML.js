const { EOL } = require('os');

module.exports = function transformEnumToDBML(
  { name, comment, values },
  schemaName,
  includeSchemaName
) {
  // It seems like dbdocs.io doesn't support a comment on the enum itself, so the comment isn't used for now

  const enumNameString = includeSchemaName ? `${schemaName}."${name}"` : `"${name}"`;

  return `Enum ${enumNameString} {${EOL}\t${values
    .map(value => `"${value}"`)
    .join(`${EOL}\t`)}${EOL}}${EOL}${EOL}`;
};

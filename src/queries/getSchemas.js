
const db = require('../db')

const baseQuery = `select nspname from pg_catalog.pg_namespace pn`;

// must conform to Postgres LIKE/NOT LIKE regex syntax, see https://www.postgresql.org/docs/9.3/functions-matching.html
const systemSchemas = [
  'pg_%',
  'information%'
];

const getWhereClause = (includeSchemas, skipSchemas) => {

  const includeSchemaConditions = includeSchemas.reduce((acc, skipThisSchema, idx, arr) => {
    const addAnd = (idx === (arr.length - 1)) ? '' : 'OR';
    return `${acc}pn.nspname LIKE '${skipThisSchema}' ${addAnd} `;
  }, '');

  const schemasToSkip = [
    ...(skipSchemas ? skipSchemas : []),
    ...systemSchemas
  ];
  const excludeSchemaConditions = schemasToSkip.reduce((acc, skipThisSchema, idx, arr) => {
    const addAnd = (idx === (arr.length - 1)) ? '' : 'AND';
    return `${acc}pn.nspname NOT LIKE '${skipThisSchema}' ${addAnd} `;
  }, '');

  return `WHERE (${includeSchemaConditions}) ${includeSchemaConditions && excludeSchemaConditions && 'AND'} (${excludeSchemaConditions})`;
};

/**
 * @function getSchemas
 * @returns {array[string]} of schema names
 */
module.exports = async function getSchemas(includeSchemas, skipSchemas) {
  const whereClause = getWhereClause(includeSchemas, skipSchemas);
  const schemasQuery = `${baseQuery} ${whereClause};`;
  const res = await db.client.query(schemasQuery);
  return res.rows.map(schema => schema.nspname).sort();
};
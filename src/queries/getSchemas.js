
const db = require('../db')

const baseQuery = `select nspname from pg_catalog.pg_namespace pn`;

// must conform to Postgres LIKE/NOT LIKE regex syntax, see https://www.postgresql.org/docs/9.3/functions-matching.html
const systemSchemas = [
  'pg_%',
  'information%'
];

const getWhereClause = (schemaName, skipSchemas) => {
  if (schemaName) {
    return `WHERE pn.nspname = '${schemaName}'`;
  }

  const schemasToSkip = [
    ...(skipSchemas ? skipSchemas : []),
    ...systemSchemas
  ];
  const whereConditions = schemasToSkip.reduce((acc, skipThisSchema, idx, arr) => {
    const addAnd = (idx === (arr.length - 1)) ? '' : 'AND';
    return `${acc}pn.nspname NOT LIKE '${skipThisSchema}' ${addAnd} `;
  }, '');

  return `WHERE ${whereConditions}`;
};

/**
 * @function getSchemas
 * @returns {array[string]} of schema names
 */
module.exports = async function getSchemas(schemaName, skipSchemas) {
  const whereClause = getWhereClause(schemaName, skipSchemas);
  const schemasQuery = `${baseQuery} ${whereClause};`;

  console.log(`schemas query: ${schemasQuery}`);
  const res = await db.client.query(schemasQuery);
  return res.rows.map(schema => schema.nspname).sort();
};
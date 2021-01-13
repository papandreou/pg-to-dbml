const db = require('../db');

const baseQuery = `select nspname from pg_catalog.pg_namespace pn`;

// must conform to Postgres LIKE/NOT LIKE regex syntax, see https://www.postgresql.org/docs/9.3/functions-matching.html
const systemSchemas = ['pg_%', 'information%'];

// TODO: tests!
const getWhereClause = (includeSchemas, skipSchemas) => {
  const includeSchemaConditions =
    includeSchemas &&
    includeSchemas.reduce((acc, skipThisSchema, idx, arr) => {
      const addOr = idx === arr.length - 1 ? '' : ' OR ';

      return `${acc}pn.nspname LIKE '${skipThisSchema}'${addOr}`;
    }, '');

  const schemasToSkip = [...(skipSchemas || []), ...systemSchemas];

  const excludeSchemaConditions = schemasToSkip.reduce((acc, skipThisSchema, idx, arr) => {
    const addAnd = idx === arr.length - 1 ? '' : ' AND ';

    return `${acc}pn.nspname NOT LIKE '${skipThisSchema}'${addAnd}`;
  }, '');

  const whereClauseBits = [];
  let whereClause = '';

  if (includeSchemaConditions) whereClauseBits.push(`(${includeSchemaConditions})`);
  if (includeSchemaConditions && excludeSchemaConditions) whereClauseBits.push('AND');
  if (excludeSchemaConditions) whereClauseBits.push(`(${excludeSchemaConditions})`);

  if (whereClauseBits.length > 0) {
    whereClauseBits.unshift('WHERE');
    whereClause = whereClauseBits.join(' ');
  }

  return whereClause;
};

/**
 * @function getSchemas
 * @returns {array[string]} of schema names
 */
module.exports = async function getSchemas(includeSchemas, skipSchemas) {
  const whereClause = getWhereClause(includeSchemas, skipSchemas);
  const schemasQuery = whereClause ? `${baseQuery} ${whereClause}; ` : `${baseQuery} `;
  // console.log('schemasQuery: ', schemasQuery)
  const res = await db.client.query(schemasQuery);

  return res.rows.map(schema => schema.nspname).sort();
};

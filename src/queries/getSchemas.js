
const db = require('../db')

const schemasQuery = `select nspname from pg_catalog.pg_namespace;`;

module.exports = async function getSchemas() {
  const res = await db.client.query(schemasQuery);
  const nonSystemSchemas = res.rows.filter(row =>
    (row.nspname.includes('pg_') || row.nspname.includes('information')) ? false : true
  );
  return nonSystemSchemas.map(schema => schema.nspname);
};
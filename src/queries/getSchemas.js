
const schemasQuery = `select nspname from pg_catalog.pg_namespace;`;

module.exports = async function getSchemas(dbClient) {
  const res = await dbClient.query(schemasQuery);
  return res.rows.filter(row =>
    (row.nspname.includes('pg_') || row.nspname.includes('information')) ? false : true
  );
};
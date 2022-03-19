const db = require('../db');

module.exports = async function getReferencedEnums({ schema, allTableStructures }) {
  const referencedUdtNames = [
    ...new Set(
      allTableStructures.flatMap(({ structure }) =>
        structure
          .filter(column => column.data_type === 'USER-DEFINED')
          .map(column => column.udt_name)
      )
    )
  ];
  if (referencedUdtNames.length === 0) {
    return [];
  }

  const { rows } = await db.client.query(
    `select t.typname as name,
    pg_catalog.obj_description(enumtypid) as comment,
    array_agg(e.enumlabel::text) as values
    from pg_type t
    left join pg_enum e on t.oid = e.enumtypid
    join pg_catalog.pg_namespace n on n.oid = t.typnamespace
    where n.nspname = $1 and t.typcategory = 'E' and t.typname = ANY($2)
    group by 1, 2`,
    [schema, referencedUdtNames]
  );
  return rows;
};

const { Client } = require('pg');

let client;
let databaseName;

async function initialize({
  dbConnectionString,
  dbName
}) {
  databaseName = dbName;
  const connectionString = `${dbConnectionString}/${dbName}`;
  client = new Client({
    connectionString
  });
  await client.connect();
}

module.exports = {
  get client() {
    return client;
  },
  get dbName() {
    return databaseName;
  },
  initialize
}

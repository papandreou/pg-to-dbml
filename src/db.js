const { Client } = require('pg');

let client;

async function initialize({ dbConnectionString, dbName }) {
  let connectionString = dbConnectionString;
  if (dbName) {
    // Add the database name to the connection string, while tolerating a trailing slash:
    dbConnectionString = connectionString.replace(/\/?$/, `/${dbName}`);
  }

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
    return this.client.connectionParameters.database;
  },
  initialize
};

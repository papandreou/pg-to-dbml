const { Client } = require('pg');

module.exports = async function initializeDb(connectionString) {
  const dbClient = new Client({
    connectionString
  });

  await dbClient.connect();
  return dbClient;
}


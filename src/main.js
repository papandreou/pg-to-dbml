const Yargs = require('yargs');
const toDbml = require('./commands/to-dbml');
const pgConnectionString = require('pg-connection-string');

function builder(myYargs) {
  return myYargs
    .alias('o', 'output_path')
    .options({
      connection_string: {
        alias: 'c',
        demandOption: true,
        describe: 'database connection string for the db you want to output dbml file(s).'
      },
      db_name: {
        alias: 'db',
        describe:
          'database name you want to create dbml file(s) from. Required if and only if the database name is not part of the connection string'
      },
      exclude_schemas: {
        alias: 'S',
        describe: 'schema names or Postgres regexes, e.g. inventory temp_%',
        type: 'array'
      },
      exclude_tables: {
        alias: 'T',
        describe: 'table names or Postgres regexes to skip, e.g. lookup_% temporary',
        type: 'array'
      },
      include_schemas: {
        alias: 's',
        describe: 'database schema names you want to create dbml file(s) from.',
        type: 'array'
      },
      o: {
        default: './',
        describe: 'output dir for the resulting dbml file(s).'
      },
      sep: {
        alias: 'separate_dbml_by_schema',
        default: false,
        describe:
          'If present, will output dbml to separate files based on schema name, e.g. schema.dbml',
        type: 'boolean'
      }
    })
    .nargs('t', 1)
    .alias('t', 'timeout')
    .describe('t', 'how long you want process to run (in milliseconds) before it exits process.')
    .default('t', 5000)
    .check(({ connection_string, db }) => {
      const databaseInConnectionString = pgConnectionString.parse(connection_string).database;
      if (databaseInConnectionString) {
        if (db) {
          return 'You cannot specify the database name separately with the --db switch when it is part of the connection string';
        }
      } else if (!db) {
        return 'You must specify the database name as part of the connection string, or separately via the --db switch';
      }
      return true;
    });
}

// eslint-disable-next-line no-unused-expressions
Yargs.command(
  ['to-dbml', '$0'],
  'default command. connects to pg db directly and creates dbml files.',
  builder,
  argv => toDbml(argv)
)
  .demandCommand(1, 'You need at least one command before moving on')
  .help()
  .fail((msg, err, yargs) => {
    if (err) throw err; // preserve stack
    console.error('You broke it!');
    console.error(msg);
    console.error('You should be doing', yargs.help());
    process.exit(1);
  }).argv;

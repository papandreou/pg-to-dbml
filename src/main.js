

const yargs = require('yargs')
const pgToDbmlDirect = require('./commands/pg-dbml');
const pgDumpToDBML = require('./commands/pg_dump-to-dbml');

function builder(myYargs) {
  return myYargs.alias('o', 'output_path')
    .options({
      'connection_string': {
        alias: 'c',
        demandOption: true,
        describe: 'database connection string for the db you want to output dbml file(s).'
      },
      'db_name': {
        alias: 'db',
        demandOption: true,
        describe: 'database name you want to create dbml file(s) from.'
      },
      'schema_name': {
        alias: 's',
        describe: 'database schema name you want to create dbml file(s) from.'
      },

      'o': {
        default: './',
        describe: 'where you want the dbml files to be outputted.'
      }
    })
    .nargs('t', 1)
    .alias('t', 'timeout')
    .describe('t', 'how long you want process to run (in milliseconds) before it exits process.')
    .default('t', 5000);
}

yargs
  .command(
    ['pg-dbml', '$0'],
    'default command. connects to pg db directly and creates dbml files.',
    builder,
    argv => pgToDbmlDirect(argv)
  )
  .command(
    ['pg_dump-to-dbml', '$0'],
    'uses pg_dump to dump db/schema sql and creates dbml files.',
    builder,
    argv => pgDumpToDBML(argv)
  )
  .demandCommand(1, 'You need at least one command before moving on')
  .help()
  .fail(function (msg, err, yargs) {
    if (err) throw err // preserve stack
    console.error('You broke it!')
    console.error(msg)
    console.error('You should be doing', yargs.help())
    process.exit(1)
  })
  .argv;

# pg-to-dbml

### Description
CLI tool to scan your postgres database, and output DBML.
- [pg-to-dbml](#pg-to-dbml)
    - [Description](#description)
    - [Tech Stack](#tech-stack)
    - [Download and install](#download-and-install)
    - [How to use the cli](#how-to-use-the-cli)
    - [Example Usage](#example-usage)
  - [Linting](#linting)
  - [Debugging](#debugging)
  - [Changelog](#changelog)

### Tech Stack

- [NodeJS](https://nodejs.org/en/docs/)
- [Yargs](http://yargs.js.org/)
- [PG](https://node-postgres.com/)

### Download and install

`npm imstall pg-to-dbml` 

### How to use the cli

To see all the commands and options, run `pg-to-dbml --help`

```
Usage: pg-to-dbml [command] [options]

Commands:
  to-dbml  default command. connects to pg db directly and creates dbml
                    files.                                             [default]

Options:
  --version                Show version number                         [boolean]
  --help                   Show help                                   [boolean]
  --connection_string, -c  database connection string for the db you want to
                           output dbml file(s).                       [required]
  --db_name, --db          database name you want to create dbml file(s) from.
                                                                      [required]
  --schema_name, -s        database schema name you want to create dbml file(s)
                           from.
  --skip_schemas, -S       comma delimited string of schema names or Postgres
                           regexes, e.g. inventory,temp_%
  --skip_tables, -T        comma delimited string of table names or Postgres
                           regexes to skip, e.g. lookup_%,temporary
  -o, --output_path        where you want the dbml files to be outputted.
                                                                 [default: "./"]
  -t, --timeout            how long you want process to run (in milliseconds)
                           before it exits process.              [default: 5000]
```

### Example Usage

// simple use case
`pg-to-dbml --c=postgresql://USER:PASSWORD@HOST:PORT -o=pathToOutput --db=DB_NAME `

// fuller use case  
`pg-to-dbml -c postgresql://USER:PASSWORD@HOST:PORT -o=pathToOutput --db DB_NAME -s SCHEMA_NAME -T tablesToSkip` 

## Linting

We are using ESLint to lint our code as we code and when we push our code. For configuring, see `.eslintrc.js` and `.prettierrc`.

## Debugging

Running in debug mode in VS Code is easy. Toggle the debugger to auto-attach, and then call from the integrated terminal:

`node --inspect-brk --db=DB_NAME --c=postgresql://USER:PASSWORD@HOST:PORT -o='../'`

## Changelog

All pull requests should include an update to the [CHANGELOG](./CHANGELOG.md) that follows the existing pattern there.

Version numbers will follow [Semantic Versioning](https://semver.org/).

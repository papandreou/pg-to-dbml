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

```
Usage: pg-to-dbml [options]

Options:
  --help                   Show help                                   [boolean]
  --version                Show version number                         [boolean]
  -o, --output_path        where you want the dbml files to be outputted.
                                                                 [default: "./"]
  -c, --connection_string  database connection string for the db you want to
                           output dbml file(s).                       [required]
  --db, --db_name          database name you want to create dbml file(s) from.
                                                                      [required]
  -t, --timeout            how long you want process to run before it exits
                           process.                              [default: 5000]
```

### Example Usage
`pg-to-dbml --db=DB_NAME --c=postgresql://USER:PASSWORD@HOST:PORT -o='../'`

## Linting

We are using ESLint to lint our code as we code and when we push our code. For configuring, see `.eslintrc.js` and `.prettierrc`.

## Debugging

Running in debug mode in VS Code is easy. Toggle the debugger to auto-attach, and then call from the integrated terminal:

`node --inspect-brk --db=DB_NAME --c=postgresql://USER:PASSWORD@HOST:PORT -o='../'`

## Changelog

All pull requests should include an update to the [CHANGELOG](./CHANGELOG.md) that follows the existing pattern there.

Version numbers will follow [Semantic Versioning](https://semver.org/).

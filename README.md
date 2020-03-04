# pg-to-dbml

### Description
CLI tool to scan your postgres database, and output DBML.
- [pg-to-dbml](#pg-to-dbml)
    - [Description](#description)
  - [Overview](#overview)
    - [Resources](#resources)
    - [Download](#download)
    - [How to use the cli](#how-to-use-the-cli)
    - [Example Usage](#example-usage)
  - [Linting](#linting)
  - [Changelog](#changelog)

## Overview

The purpose of the reference application is to provide a starting point for Node.js development that encapsulates good tools and best practices such as TypeScript, configuration management, linting, testing, and documentation.

### Resources

- [NodeJS](https://nodejs.org/en/docs/)
- [Yargs](http://yargs.js.org/)
- [PG](https://node-postgres.com/)

### Download
`npm i 

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

## Linting

We are using ESLint to lint our code as we code and when we push our code. For configuring, see `.eslintrc.js` and `.prettierrc`.


## Changelog

All pull requests should include an update to the [CHANGELOG](./CHANGELOG.md) that follows the existing pattern there.

Version numbers will follow [Semantic Versioning](https://semver.org/).

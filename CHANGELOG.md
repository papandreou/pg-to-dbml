# CHANGELOG

## 0.2.1

### Changes

- Fixed bug #21
- Updated queries to work with Postgres system tables and commands, per Postgres version 9.3.25.
- Updated column default note to use double quotes since the database column notes themselves can have single-quotes.
- Added transform of `time without timezone` to `timestamp`
- Added transform of `double precision` to `number`

## 0.2.0

### Changes

- Refactored to abstract logic to separate function modules, use await-async rather than callbacks.
- DIS-814
  - refactored main.js for clearer, more explicit options
  - added options -s for schemas to include, -S for schemas to skip, -T for tables to skip
  - added dbml output of primary key and relations between tables
  - added option --separate_dbml_by_schema to determine whether to separate dbml output file(s) by schema name,
    if multiple schemas are included and output to one file then table name is prefixed by schema name, e.g. `schema.table`
  - added ability to determine foreign key relations even across schemas

## 0.1.11

### Changes

- DIS-650 - Create script to create DBML doc for DB Diagrams
- Publish to Github Packages using Actions
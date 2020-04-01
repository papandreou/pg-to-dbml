# CHANGELOG

## next

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
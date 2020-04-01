# CHANGELOG

## next

### Changes

- Refactored to abstract logic to separate function modules, use await-async rather than callbacks.
- DIS-814
  - refactored main.js for clearer, more explicit options
  - added options -s for schemas to include, -S for schemas to skip, -T for tables to skip
  - added dbml output of primary key and relations between tables

## 0.1.11

### Changes

- DIS-650 - Create script to create DBML doc for DB Diagrams
- Publish to Github Packages using Actions
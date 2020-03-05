#!/usr/bin/env node
const { Client } = require('pg');
const fs = require('fs');
const argv = require('yargs')
    .usage('Usage: $0 [options]')
    .alias('o', 'output_path')
    .nargs('o', 1)
    .describe('o', 'where you want the dbml files to be outputted.')
    .default('o', './')
    .alias('c', 'connection_string')
    .nargs('c', 1)
    .describe('c', 'database connection string for the db you want to output dbml file(s).')
    .alias('db', 'db_name')
    .nargs('db', 1)
    .describe('db', 'database name you want to create dbml file(s) from.')
    .alias('t', 'timeout')
    .nargs('t', 1)
    .describe('t', 'how long you want process to run before it exits process.')
    .default('t', 5000)
    .demandOption(['c', 'db'])
    .argv
const { c, db, o, t} = argv;
const dbClient = new Client({
  connectionString: `${c}/${db}`
});
try {
    dbClient.connect(); 
} catch (err) {
    process.exit(err)
}

const schemasQuery = `select nspname
from pg_catalog.pg_namespace;`;
const tablesInSchemaQuery = schemaName =>
  `select tablename from pg_tables where schemaname='${schemaName}'`;
const tableColumnInfoQuery = tableName => `select cols.column_name, cols.column_default, cols.is_nullable, cols.data_type, cols.udt_name, cols.character_maximum_length, cols.datetime_precision,
(select MAX(pg_catalog.col_description(oid,cols.ordinal_position::int)) from pg_catalog.pg_class c where c.relname=cols.table_name) as column_comment
from information_schema.columns cols
where cols.table_catalog='${db}' and cols.table_name='${tableName}'`;

function writeToDBML(columnsAndcolumnInfo, tableName, schemaName, fileName) {
  const convertToDBML = columnsAndcolumnInfo.map(col => {
    const characterVarying = col.data_type === 'character varying' ? col.udt_name : null;
    const timeStamp = col.data_type === 'timestamp with time zone' ? 'timestamp' : null;
    const dataType = characterVarying || timeStamp || col.data_type;
    const characterMaxLength = col.character_maximum_length
      ? `(${col.character_maximum_length}) `
      : ' ';
    const nullable = col.is_nullable ? '' : 'not null, ';
    const cleanUpColumnDefault = col.column_default && col.column_default.includes('::text')
      ? col.column_default.replace(/::text/gi, '').replace(/'/gi, '')
      : col.column_default;
    const columnDefault = cleanUpColumnDefault
      ? `default:'${cleanUpColumnDefault}'${nullable ? ', ' : ''}`
      : '';
    const note = col.column_comment ? `note:'${col.column_comment}'` : '';
    const squareBrackets =
      nullable || columnDefault || note ? `[${nullable}${columnDefault}${note}]` : '';
    const DBMLDefiniton = `\t${col.column_name} ${dataType}${characterMaxLength}${squareBrackets}`;
    return DBMLDefiniton;
  });
  convertToDBML.unshift(`Table ${tableName} {`);
  convertToDBML.push('}\n\n');
  const returnValue = convertToDBML.join('\n');
  o && console.log(`creating/adding to: ${schemaName}.dbml to your output path with the dbml definition of table ${tableName}.`)
  o ? fs.appendFile(fileName, returnValue, 'utf8', () => {}) : console.log(returnValue);
}

function tableColumnInfoQueryFunc(tableNameArr, schemaName, fileName) {
  tableNameArr.forEach(tableName => {
    const query = tableColumnInfoQuery(tableName);
    dbClient.query(query, (err, res) => {
      if (err) process.exit(`${tableName}: ${err}`);
      writeToDBML(res.rows, tableName, schemaName, fileName);
    });
  });
}

function tablesInSchemaFunc(schemaNameArr) {
  schemaNameArr.forEach(schema => {
    const schemaName = schema.nspname;
    const schemaNameQuery = tablesInSchemaQuery(schemaName);
    dbClient.query(schemaNameQuery, (err, res) => {
      if (err) process.exit(err);
      const tableNameArr = res.rows.map(row => row.tablename);
      const fileName = `${o || './'}${schemaName}.dbml`
      if(fs.existsSync(fileName, fs.constants.R_OK | fs.constants.W_OK)) {
        fs.writeFileSync(fileName, '', ()=> {});
      }
      tableColumnInfoQueryFunc(tableNameArr, schemaName, fileName);
    });
  });
}

function schemaQueryFunc() {
  dbClient.query(schemasQuery, (err, res) => {
    if (err) process.exit(err);
    const schemasWeMightBeUsing = res.rows.filter(row => {
      let answer = true;
      if (row.nspname.includes('pg_')) {
        answer = false;
      } else if (row.nspname.includes('information')) {
        answer = false;
      }
      return answer;
    });
    tablesInSchemaFunc(schemasWeMightBeUsing);
  });
}

function main() {
    schemaQueryFunc();
    setTimeout(() => process.exit(`Check your output path. Your db now has dbml definitions!`), t || 5000)
}
main();
process.on('exit', (code) => {
    return console.log(code);
})
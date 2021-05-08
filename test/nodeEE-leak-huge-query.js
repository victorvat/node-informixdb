const common = require('./common');
const odbc = require('../');
const db = new odbc.Database();
const assert = require('assert');
const util = require('util');
const tableOne = 'leaktable1';
const tableTwo = 'leaktable2';
const tableThree = 'leaktable3';
const tableLimit = 4000;
const maxVarChar = 'LEAKTESTLEAKTESTLEAKTESTLEAKTESTLEAKTESTLEAKTESTLEAKTESTLEAKTESTLEAKTESTLEAKTESTLEAKTESTLEAKTESTLEAKTESTLEAKTESTLEAKTESTLEAKTESTLEAKTESTLEAKTESTLEAKTESTLEAKTESTLEAKTESTLEAKTESTLEAKTESTLEAKTESTLEAKTESTLEAKTESTLEAKTESTLEAKTESTLEAKTESTLEAKTESTLEAKTESTLEAKTES';
let insertCount = 0;
let dropCount = 0;
let insertCallBackCount = 0;
let initialMemHeap = 0;
const maxDiff = 1000000;

try {
  global.gc();
  initialMemHeap = util.inspect(process.memoryUsage().heapUsed);
  db.open(common.connectionString, function (err) {
    createTablesQuery();

    while (insertCount < tableLimit) {
      insertCount++;
      insertQueries();
    }

    if (insertCount === tableLimit) {
      finalQueries();
    }
  });
} catch (e) {
  console.log(e);
  db.close(function () {
    console.log('Connection closed on error');
  });
}

function createTablesQuery () {
  db.query('create table ' + tableOne + ' (PID INTEGER, C1 VARCHAR(255), C2 VARCHAR(255), C3 VARCHAR(255))', function (err, data) {
    if (err == null) {
      // console.log("Table " + tableOne + " created");
    } else {
      console.log(err);
    }
  });

  db.query('create table ' + tableTwo + ' (PID INTEGER, C1 VARCHAR(255), C2 VARCHAR(255), C3 VARCHAR(255))', function (err, data) {
    if (err == null) {
      // console.log("Table " + tableTwo + " created");
    } else {
      console.log(err);
    }
  });
}

function insertQueries () {
  query = "values ('" + insertCount + "', '" + maxVarChar + "', '" + maxVarChar + "', '" + maxVarChar + "')";
  db.query('insert into ' + tableOne + ' ' + query, icback);
  db.query('insert into ' + tableTwo + ' ' + query, icback);
}

function finalQueries () {
  db.query('select * from ' + tableOne, scback);
  db.query('select * from ' + tableTwo, scback);
  db.query('select * from ' + tableOne + ' INNER JOIN ' + tableTwo + ' ON ' + tableOne + '.PID = ' + tableTwo + '.PID', scback);
  db.query('drop table ' + tableOne, drcback.bind({ tableName: tableOne }));
  db.query('drop table ' + tableTwo, drcback.bind({ tableName: tableTwo }));
}

function icback (err, data) {
  if (err == null) {
    insertCallBackCount++;
    // console.log("INSERT", insertCallBackCount);
  } else {
    console.log(err);
  }
}

function scback (err, data) {
  if (err == null) {
    // console.log ("SELECT STATEMENT SUCCESSFUL");
  } else {
    console.log(err);
  }
}

function drcback (err, data) {
  dropCount++;
  if (err == null) {
    // console.log ("DROP TABLE " + this.tableName + " SUCCESSFUL");
  } else {
    console.log(err);
  }

  if (dropCount == 2) {
    closedbConnection();
  }
}

function closedbConnection () {
  db.close(function () {
    // console.log("Database Connection Closed");
    checkMemory();
  });
}
function checkMemory () {
  global.gc();
  diffHeapUse = util.inspect(process.memoryUsage().heapUsed) - initialMemHeap;
  // console.log("DIFFERENCE ", diffHeapUse);
  assert(diffHeapUse < maxDiff);
}

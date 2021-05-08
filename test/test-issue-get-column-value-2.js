const common = require('./common');
const odbc = require('../');
const db = new odbc.Database();
const assert = require('assert');
const util = require('util');
let count = 0
  ;

var getSchema = function () {
  let db = new odbc.Database();

  console.log(util.format('Count %s, time %s', count, new Date()));
  // console.log(db);

  db.open(common.connectionString, function (err) {
    if (err) {
      console.error('connection error: ', err.message);
      db.close(function () {});
      assert(err.message, null);
    }

    db.describe({ database: 'SAMPLE', schema: 'AVINASH', table: common.tableName }, function (err, rows) {
      //    db.query("select * from " + common.tableName, function (err, rows) {
      if (err) {
        console.error('describe error: ', err.message);
        db.close(function () {});
        return;
      }

      db.close(function () {
        console.log('Connection Closed');
        db = null;
        count += 1;
        if (count < 10) {
          setImmediate(getSchema);
        } else {
          process.exit(0);
        }
      });
    });
  });
};

getSchema();

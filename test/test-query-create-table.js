const common = require('./common');
const odbc = require('../');
const db = new odbc.Database();
const assert = require('assert')
  ;

db.openSync(common.connectionString);
common.createTables(db, function (err, data, morefollowing) {
  console.log(arguments);
  db.closeSync();
});

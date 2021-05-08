const common = require('./common');
const odbc = require('../');
const db = new odbc.Database();
const assert = require('assert')
  ;

db.openSync(common.connectionString);
common.dropTables(db, function (err, data) {
  db.closeSync();
  assert.equal(err, null);
  assert.deepEqual(data, []);
});

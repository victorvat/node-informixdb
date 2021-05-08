const common = require('./common');
const odbc = require('../');
const db = new odbc.Database();
const assert = require('assert')
  ;

db.openSync(common.connectionString);
assert.equal(db.connected, true);
let err = null;

try {
  const data = db.querySync('select invalid query');
} catch (e) {
  console.log(e);

  err = e;
}

db.closeSync();
assert.equal(err.error, '[node-informixdb] Error in ODBCConnection::QuerySync');

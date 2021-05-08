const common = require('./common');
const odbc = require('../');
const db = odbc({ fetchMode: odbc.FETCH_ARRAY });
const assert = require('assert')
  ;

db.openSync(common.connectionString);

assert.equal(db.connected, true);

db.query("select 1 as COLINT, 'some test' as COLTEXT FROM TABLE(SET{1})", function (err, data) {
  assert.equal(err, null);

  db.closeSync();
  assert.deepEqual(data, [[1, 'some test']]);
});

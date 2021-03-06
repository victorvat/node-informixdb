const common = require('./common');
const odbc = require('../');
const db = new odbc.Database();
const assert = require('assert')
  ;

db.openSync(common.connectionString);
assert.equal(db.connected, true);

const query = { sql: "select 1 as COLINT, 'some test' as COLTEXT FROM TABLE(SET{1})" };
db.queryResult(query, function (err, result) {
  assert.equal(err, null);
  assert.equal(result.constructor.name, 'ODBCResult');

  result.fetch(function (err, data) {
    db.closeSync();
    console.log('Returned data = ' + JSON.stringify(data));
    assert.deepEqual(data, { colint: '1', coltext: 'some test' });
  });
});

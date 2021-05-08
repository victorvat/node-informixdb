const common = require('./common');
const odbc = require('../');
const db = new odbc.Database();
const assert = require('assert')
  ;

assert.equal(db.connected, false);

db.query('select * from test', function (err, rs, moreResultSets) {
  assert.deepEqual(err, { message: 'Connection not open.' });
  assert.deepEqual(rs, []);
  assert.equal(moreResultSets, false);
  assert.equal(db.connected, false);
});

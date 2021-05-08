const common = require('./common');
const odbc = require('../');
const db = new odbc.Database();
const assert = require('assert');

assert.equal(db.connected, false);

db.query('select * from ' + common.tableName, function (err, rs, moreResultSets) {
  assert.deepEqual(err, { message: 'Connection not open.' });
  assert.deepEqual(rs, []);
  assert.equal(moreResultSets, false);
  assert.equal(db.connected, false);
});

db.open(common.connectionString, function (err) {
  assert.equal(err, null);
  assert.equal(db.connected, true);

  db.close(function () {
    assert.equal(db.connected, false);

    db.query('select * from ' + common.tableName, function (err, rs, moreResultSets) {
      assert.deepEqual(err, { message: 'Connection not open.' });
      assert.deepEqual(rs, []);
      assert.equal(moreResultSets, false);
      assert.equal(db.connected, false);
    });
  });
});

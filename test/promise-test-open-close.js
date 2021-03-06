const common = require('./common');
const odbc = require('../');
const db = new odbc.Database();
const assert = require('assert');

// assert.equal(db.connected, false);

db.query('select * from ' + common.tableName).then(null, function (err) {
  assert.deepEqual(err, { message: 'Connection not open.' });
  assert.equal(db.connected, false);
});

db.open(common.connectionString).then(function (res) {
  assert.equal(db.connected, true);

  db.close().then(function () {
    assert.equal(db.connected, false);

    db.query('select * from ' + common.tableName).then(null, function (err) {
      assert.deepEqual(err, { message: 'Connection not open.' });
      assert.equal(db.connected, false);
    });
  });
});

const common = require('./common');
const odbc = require('../');
const db = new odbc.Database();
const assert = require('assert')
  ;

db.open(common.connectionObject, function (err) {
  assert.equal(err, null);

  db.close(function () {
    assert.equal(db.connected, false);
  });
});

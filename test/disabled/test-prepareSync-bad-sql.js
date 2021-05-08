const common = require('./common');
const odbc = require('../');
const db = new odbc.Database();
const assert = require('assert')
  ;

db.openSync(common.connectionString);
assert.equal(db.connected, true);

const stmt = db.prepareSync('asdf asdf asdf asdf sadf ');
assert.equal(stmt.constructor.name, 'ODBCStatement');

stmt.bindSync(['hello world', 1, null]);

stmt.execute(function (err, result) {
  assert.ok(err);

  stmt.executeNonQuery(function (err, count) {
    assert.ok(err);

    db.close(function () {});
  });
});

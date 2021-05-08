const common = require('./common');
const odbc = require('../');
const assert = require('assert');

odbc.open(common.connectionString, function (err, conn) {
  assert.equal(err, null);
  assert.equal(conn.constructor.name, 'Database');

  conn.close();
});

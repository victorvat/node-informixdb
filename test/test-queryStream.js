const common = require('./common');
const odbc = require('../');
const db = new odbc.Database();
const assert = require('assert')
  ;

db.openSync(common.connectionString);
assert.equal(db.connected, true);

const stream = db.queryStream('wrong query');
// adding the 'data' eventhandler starts the stream
stream.once('data', function (data) {
  throw new Error('data should not return from an erroring queryStream.');
}).once('error', function (err) {
  assert.equal(err.state, '42000');
  db.close(function () {
    console.log('Error test for queryStream completed successfully.');
  });
});

odbc.open(common.connectionString, function (err, conn) {
  if (err) return console.log(err);
  assert.equal(conn.connected, true);

  const sql = "select 1 as COLINT, 'some test' as COLTEXT FROM TABLE(SET{1})";
  const stream = conn.queryStream(sql);

  stream.once('data', function (data) {
    assert.deepEqual(data, { colint: '1', coltext: 'some test' });
    console.log('Select test for queryStream completed successfully.');
  }).once('error', function (err) {
    conn.closeSync();
    throw err;
  }).once('end', function () {
    conn.close(function () { console.log('done.'); });
  });
});

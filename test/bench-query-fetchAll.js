const common = require('./common');
const odbc = require('../');
const db = new odbc.Database();

db.open(common.connectionString, function (err) {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  issueQuery();
});

function issueQuery () {
  let count = 0;
  const iterations = 100;
  //, iterations = 10000
  const time = new Date().getTime();

  for (let x = 0; x < iterations; x++) {
    db.queryResult('select 1 + 1 as test from table(set{1})', cb);
  }

  function cb (err, result) {
    if (err) {
      console.error(err);
      return finish();
    }

    result.fetchAll(function (err, data) {
      if (err) {
        console.error(err);
        return finish();
      }

      result.closeSync();

      if (++count == iterations) {
        const elapsed = (new Date().getTime() - time) / 1000;
        process.stdout.write('(' + count + ' queries issued in ' + elapsed + ' seconds, ' + (count / elapsed).toFixed(2) + ' query/sec)');
        return finish();
      }
    });
  }

  function finish () {
    db.close(function () {});
  }
}

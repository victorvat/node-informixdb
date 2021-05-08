const common = require('./common');
const odbc = require('../');
const db = new odbc.Database({ fetchMode: odbc.FETCH_ARRAY });

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
    const data = db.querySync('select 1 + 1 as test from table(set{1})');
    count += 1;
  }

  const elapsed = (new Date().getTime() - time) / 1000;
  process.stdout.write('(' + count + ' queries issued in ' + elapsed + ' seconds, ' + (count / elapsed).toFixed(2) + ' query/sec)');
  db.close(function () {});
}

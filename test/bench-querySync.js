const common = require('./common');
const odbc = require('../');
const db = new odbc.Database();

db.open(common.connectionString, function (err) {
  if (err) {
    console.error(err);
    console.log(err);
    console.log(common.connectionString);
    process.exit(1);
  }
  issueQuery();
});

function issueQuery () {
  let count = 0;
  //, iterations = 10000
  const iterations = 100;
  const time = new Date().getTime();

  for (let x = 0; x < iterations; x++) {
    const data = db.querySync('select 1 + 1 as test from table(set{1})');
    count += 1;
  }

  const elapsed = (new Date().getTime() - time) / 1000;
  process.stdout.write('(' + count + ' queries issued in ' + elapsed + ' seconds, ' + (count / elapsed).toFixed(2) + ' query/sec)');
  db.close(function () { });
}

const common = require('./common');
	 const odbc = require('../');
	 const db = new odbc.Database();

let insertString = '';
const batchSize = 1000;

db.open(common.connectionString, function (err) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  createInsertString(batchSize);
  dropTable();
  createTable();
});

function createInsertString (batchSize) {
  insertString = "insert into bench_insert (str) select * from table(list{ row('testing')";
  for (let i = 0; i < batchSize; i++) {
    insertString += ", row('testing')";
  }
  insertString += '})';
}
function createTable () {
  db.query('create table bench_insert (str varchar(50))', function (err) {
    if (err) {
      console.log(err);
      return finish();
    }

    return insertData();
  });
}

function dropTable () {
  try {
    db.querySync('drop table bench_insert');
  } catch (e) {
    //    console.log(e);
    // do nothing if the table doesn't exist
  }
}

function insertData () {
  let count = 0;
		 const iterations = 100;
  //, iterations = 10000
		 const time = new Date().getTime();

  for (let x = 0; x < iterations; x++) {
    db.query(insertString, cb);
  }

  function cb (err) {
    if (err) {
      console.log(err);
      return finish();
    }

    if (++count == iterations) {
      const elapsed = (new Date().getTime() - time) / 1000;
      process.stdout.write('(' + batchSize * iterations + ' records inserted in ' + elapsed + ' seconds, ' +
                                 (batchSize * iterations / elapsed).toFixed(4) + ' records/sec)');
      return dropTable();
    }
  }
}

function finish () {
  db.close(function () {
    console.log('connection closed');
  });
}

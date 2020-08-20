var common = require("./common")
  , informixdb = require("../")
  , assert = require("assert")
  , cn = common.connectionString;

informixdb.debug(true);

informixdb.open(cn, function (err, conn) {
  if (err) console.log(err);
  assert.equal(err, null);

  console.log("1) drop table");
  try {
    conn.querySync("drop table mytab1");
  } catch (e) {
    console.log(e);
  }

  console.log("2) create table");
  try {
    conn.querySync("create table mytab1 (c1 int, c2 SMALLINT, c3 BIGINT, c4 INTEGER, c5 DECIMAL(3), c6 DOUBLE PRECISION, c7 float, c8 decimal, c9 decimal(10,3), c10 char(10), c11 varchar(10), c12 boolean, c14 date, c15 datetime hour to second, c16 interval year to month);");
  } catch (e) {
    console.log(e);
  }

  console.log("3) insert data");
  try {
    const sqlStr = "insert into mytab1 values (1, 2, 456736789, 1234, 67.98, 5689, 56.2390, 34567890, 45.234, 'bimal', 'kumar', 't', " +
      "MDY(1,1,2017), DATETIME (10:16:33) HOUR TO SECOND, INTERVAL (2009-10) YEAR TO MONTH)";
    console.log(sqlStr);
    conn.querySync(sqlStr);
  } catch (e) {
    console.log(e);
  }

  console.log("4) select data");
  conn.query("select * from mytab1", function (err, data) {
    if (err) console.log(err);
    else {
      console.log(data);
    }
    conn.querySync("drop table mytab1");
    conn.closeSync();

    assert.deepEqual(data,
      [{
        c1: 1,
        c2: 2,
        c3: '456736789',
        c4: 1234,
        c5: '68.0',
        c6: '5689',
        c7: 56.239,
        c8: '34567890.0',
        c9: '45.234',
        c10: 'bimal     ',
        c11: 'kumar',
        c12: true,
        c14: '2017-01-01',
        c15: '10:16:33',
        c16: ' 2009-10'
      }]);

  });
});

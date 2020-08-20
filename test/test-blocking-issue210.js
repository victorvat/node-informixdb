var common = require("./common")
	, informixdb = require("../")
	, pool = new informixdb.Pool()
	, connectionString = common.connectionString
    , assert = require("assert")
	, connections = []
	, connectCount = 2;

var startTime1, startTime2, totalTime1, totalTime2, dropTable = 0;
var elapsedTime = informixdb.getElapsedTime;
var ret = pool.init(connectCount, connectionString); 
if(typeof ret === 'object') assert.equal(ret.message, undefined);

//moment().format("YYYY-MM-DD HH:mm:ss.SSS"));
console.log(elapsedTime(), "Started pool.open, populate a table MTAB1 of 40K rows.");
pool.open(connectionString, function( err, conn) {
	console.log(elapsedTime(), "pool.open");
    try { conn.querySync("drop table mtab1");
          conn.querySync("drop table mtab2"); } catch(e) {};
    conn.querySync("create table mtab1(c1 varchar(30), c2 varchar(20))");
    conn.querySync("create table mtab2(c1 varchar(30), c2 varchar(20))");
    conn.querySync("Insert into mtab1 select * from table (list{ row('1', 'bimal'),row('2','kumar'),row('3', 'jhaaa'), row('4', 'kamal'), row('5', 'infmx') })");
    conn.querySync("Insert into mtab1 select * from table (list{ row('1', 'bimal'),row('2','kumar'),row('3', 'jhaaa'), row('4', 'kamal'), row('5', 'infmx') })");
    for(var i = 0; i < 9 ; i++) {
      conn.querySync("insert into mtab2 select * from mtab1");
      conn.querySync("insert into mtab1 select * from mtab2");
      }
	
    conn.querySync("drop table mtab2");
	console.log( "Inserted rows in mtab1 = ", conn.querySync("select count(*) from systables")[0]['1']);
    conn.close(function(err){});
});
console.log(elapsedTime(), "After insert.");
//informixdb.debug(true);
var q1time, q2time;
console.log(elapsedTime(), "Opening connection #1");
pool.open(connectionString, function (err, connection) {
        console.log(elapsedTime(), "Connection 1 opened. Start execution of Query1");
        startTime1 = new Date();
        connection.query("select * from mtab1", function(err, data) {
                if(err) console.log(err);
                totalTime1 = (new Date() - startTime1)/1000;
                q1time = parseInt(totalTime1%60);
                console.log(elapsedTime(), "Total execution time for Query1 = ", q1time, "sec."); 
                dropTable++;
                if(dropTable == 2) {
                  assert.equal(q1time > 10, false);
                  testLongTime(connection);
                }
        });
});
pool.open(connectionString, function (err, connection) {
        console.log(elapsedTime(), "Connection 2 opened. Start execution of Query2");
        startTime2 = new Date();
        connection.query("select c1, c2 from mtab1", function(err, data) {
                if(err) console.log(err);
                totalTime2 = (new Date() - startTime2)/1000;
                q2time = parseInt(totalTime2%60);
                console.log(elapsedTime(), "Total execution time for Query2 = ", q2time, "sec."); 
                dropTable++;
                if(dropTable == 2) {
                  assert.equal(q2time > 10, false);
                  testLongTime(connection);
                }
        });
});

// Test case for issue #230
var testLongTime = function(conn) {
    conn.querySync("insert into mtab1 values ('330107196906080910', '330107196906080910'); "+
                   "insert into mtab1 values ('330107196906080910', '330107196906080910');"+
					"insert into mtab1 values('330107196906080910', '')");
    var query1 = "select c1, c2 from mtab1 where (c1 in (?, ?) or c2 in (?, ?) and (? is null or c2 = ?))";
    var query2 = "select c1, c2 from mtab1 where (c1 in ('330107196906080910', '330107196906080910') " +
                 "or c2 in ('330107196906080910', '330107196906080910') and ('' is null or c2 = ''))";
    var params = ['330107196906080910', '330107196906080910', '330107196906080910','330107196906080910', '', ''];
    startTime1 = new Date();
    conn.query(query1, params, function(err, rows) {
        if(err) console.log(err);
        else console.log(rows);
        totalTime1 = (new Date() - startTime1)/1000;
        console.log(elapsedTime(), "Total execution time for Query3 = ", totalTime1, "sec. **** <<==");
        startTime2 = new Date();
        conn.query(query2, function(err, rows) {
            if(err) console.log(err);
            else console.log(rows);
            totalTime2 = (new Date() - startTime2)/1000;
            console.log(elapsedTime(), "Total execution time for Query4 = ", totalTime2, "sec. **** <<==");

            // Clean up
            conn.querySync("drop table mtab1");
            //informixdb.debug(false);
            pool.close();
        });
    });
}
console.log(elapsedTime(), " **** All lines of test file executed, waiting for callback functions to finish. ");


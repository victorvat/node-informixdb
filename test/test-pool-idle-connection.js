// test file to test idle connection is getting dropped or not.

const informixdb = require('../');
const pool = new informixdb.Pool();
const assert = require('assert');
const common = require('./common.js');
const cn = common.connectionString;
let starttime;
let endtime
    ;

console.log('Trying to open a new connection at => ' + getDateTime());
pool.open(cn, function (err, conn) {
  if (err) console.log(err);
  assert.equal(err, null);
  console.log('Got new connection at => ' + getDateTime());
  conn.query('select 1 from table(set{1})', function (err, data) {
    if (err) console.log(err);
    else console.log(data);

    conn.close(function () {
      console.log('Connection surrenderred to pool at ' + getDateTime());
      console.log('Now wait for 70 seconds and then access connection.');
    });

    // wait for 2 min then access connection.
    setTimeout(function () {
      starttime = getDateTime();
      console.log('70 seconds elapesed, try to get connection from pool at ==> ' + starttime);
      pool.open(cn, function (err, conn) {
        if (err) return console.log(err);
        endtime = getDateTime();
        console.log('Got connection from pool at ==> ' + endtime);
        conn.query('select 1 from table(set{1})', function (err, data) {
          if (err) console.log(err);
          else console.log(data);

          pool.close(function () {
            console.log('pool closed.');
            assert(starttime, endtime);
          });
        });
      });
    }, 70 * 1000); // setTimeout 2 minute.
  });
});

function getDateTime () {
  const date = new Date();

  let hour = date.getHours();
  hour = (hour < 10 ? '0' : '') + hour;

  let min = date.getMinutes();
  min = (min < 10 ? '0' : '') + min;

  let sec = date.getSeconds();
  sec = (sec < 10 ? '0' : '') + sec;

  const year = date.getFullYear();

  let month = date.getMonth() + 1;
  month = (month < 10 ? '0' : '') + month;

  let day = date.getDate();
  day = (day < 10 ? '0' : '') + day;

  return year + '.' + month + '.' + day + ' ' + hour + ':' + min + ':' + sec;
}

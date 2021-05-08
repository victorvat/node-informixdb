const common = require('./common');
const informixdb = require('../');
const assert = require('assert');
const fs = require('fs');
const cn = common.connectionString;
const inputfile1 = 'data/phool.jpg';
const inputfile2 = 'data/desc.txt';
const outputfile1 = 'phool2.jpg';
const outputfile2 = 'desc2.txt'
    ;

informixdb.open(cn, function (err, conn) {
  if (err) {
    console.log(err);
  }
  assert.equal(err, null);
  try {
    conn.querySync('drop table mytab');
  } catch (e) {}
  try {
    conn.querySync('create table mytab (empId int, photo BLOB, desc CLOB)');
  } catch (e) {}

  const img1 = fs.readFileSync(inputfile1, 'binary');
  const text = fs.readFileSync(inputfile2, 'ascii');

  const len1 = img1.length;
  const len2 = text.length;
  console.log('img1.length = ' + len1);
  console.log('text.length = ' + len2);

  conn.prepare('insert into mytab(empId, photo, desc) VALUES (?, ?, ?)',
    function (err, stmt) {
      if (err) {
        console.log(err);
        return conn.closeSync();
      }

      const photo = { DataType: 'BLOB', Data: img1 };
      const desc = { DataType: 'CLOB', Data: text };

      stmt.execute([18, photo, desc], function (err, result) {
        if (err) console.log(err);
        else result.closeSync();

        conn.prepare('select * from mytab', function (err, stmt) {
          if (err) {
            console.log(err);
            return conn.closeSync();
          }

          stmt.execute([], function (err, result) {
            if (err) console.log(err);
            else {
              data = result.fetchAllSync();
              fs.writeFileSync(outputfile1, data[0].photo, 'binary');
              fs.writeFileSync(outputfile2, data[0].desc, 'ascii');
              result.closeSync();
              try {
                //   conn.querySync("drop table mytab");
              } catch (e) {}

              const size1 = fs.statSync(outputfile1).size;
              const size2 = fs.statSync(outputfile2).size;
              console.log('Lengths before  = ' + len1 + ', ' + len2);
              console.log('Lengths  after  = ' + size1 + ', ' + size2);
              assert(len1, size1);
              assert(len2, size2);

              //  fs.unlinkSync(outputfile1);
              //  fs.unlink(outputfile2, function () { console.log('done'); });
            }
          });
        });
      });
    });
});

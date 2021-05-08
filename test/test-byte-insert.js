const common = require('./common');
const informixdb = require('../');
const assert = require('assert');
const fs = require('fs');
const cn = common.connectionString;

informixdb.open(cn, function (err, conn) {
  if (err) {
    console.log(err);
    process.exit(-1);
  }
  try {
    conn.querySync('drop table mytab');
  } catch (e) {}
  try {
    conn.querySync('create table mytab (empId int, photo BYTE, desc TEXT)');
  } catch (e) {}

  const fimg1 = 'data/phool.jpg';
  const ftext = 'data/desc.txt';

  const img1 = fs.readFileSync(fimg1, 'binary');
  const text = fs.readFileSync(ftext, 'ascii');
  const len1 = fs.statSync(fimg1).size;
  const len2 = fs.statSync(ftext).size;

  conn.prepare('insert into mytab(empId, photo, desc) VALUES (?, ?, ?)',
    function (err, stmt) {
      if (err) {
        console.log(err);
        return conn.closeSync();
      }
      const photo = { DataType: 'BYTE', Data: img1 };
      const desc = { DataType: 'TEXT', Data: text };
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
              fs.writeFileSync('phool2.jpg', data[0].photo, 'binary');
              fs.writeFileSync('desc2.txt', data[0].desc, 'ascii');

              result.closeSync();
              try {
                conn.querySync('drop table mytab');
              } catch (e) {}

              const size1 = fs.statSync('phool2.jpg').size;
              const size2 = fs.statSync('desc2.txt').size;
              console.log('Lengths before  = ' + len1 + ', ' + len2);
              console.log('Lengths  after  = ' + size1 + ', ' + size2);
              assert(len1, size1);
              assert(len2, size2);

              fs.unlinkSync('phool2.jpg');
              fs.unlink('desc2.txt', function () { console.log('done'); });
            }
          });
        });
      });
    });
});

const odbc = require('../');
const openCount = 100;
let start = process.memoryUsage().heapUsed;
let x = 100
    ;

gc();

start = process.memoryUsage().heapUsed;

for (x = 0; x < openCount; x++) {
  (function () {
    let db = new odbc.Database();
    db = null;
  })();
}

gc();

console.log(process.memoryUsage().heapUsed - start);

gc();

for (x = 0; x < openCount; x++) {
  (function () {
    let db = new odbc.Database();
    db = null;
  })();
}

gc();

console.log(process.memoryUsage().heapUsed - start);

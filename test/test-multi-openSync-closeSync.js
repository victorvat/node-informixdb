const common = require('./common');
	 const odbc = require('../');
	 const openCallback = 0;
	 const closeCallback = 0;
	 const openCount = 10;
	 const connections = [];
	 let errorCount = 0;

for (let x = 0; x < openCount; x++) {
  const db = new odbc.Database();
  connections.push(db);

  try {
    db.openSync(common.connectionString);
  } catch (e) {
    console.log(common.connectionString);
    console.log(e);
    errorCount += 1;
    break;
  }
}

connections.forEach(function (db) {
  db.closeSync();
});

console.log('Done');
process.exit(errorCount);

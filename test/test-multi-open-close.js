const common = require('./common');
	 const odbc = require('../');
const assert = require('assert');
	 let openCallback = 0;
	 let closeCallback = 0;
	 const openCount = 10;
	 const connections = []
	;

for (let x = 0; x < openCount; x++) {
  (function () {
    const db = new odbc.Database();
    connections.push(db);

    db.open(common.connectionString, function (err) {
      assert.equal(err, null);
      openCallback += 1;
      maybeClose();
    });
  })();
}

function maybeClose () {
  if (openCount == openCallback) {
    doClose();
  }
}

function doClose () {
  connections.forEach(function (db) {
    db.close(function () {
      closeCallback += 1;

      maybeFinish();
    });
  });
}

function maybeFinish () {
  if (openCount == closeCallback) {
    console.log('Done');
  }
}

const common = require('./common');
	 const odbc = require('../');
	 const pool = new odbc.Pool();
const assert = require('assert');
	 const connectionString = common.connectionString;
	 const connections = [];
	 const connectCount = 10;

openConnectionsUsingPool(connections);

function openConnectionsUsingPool (connections) {
  for (let x = 0; x <= connectCount; x++) {
    (function (connectionIndex) {
      console.error('Opening connection #', connectionIndex);
      pool.open(connectionString, function (err, connection) {
        // console.error("Opened connection #", connectionIndex);
        if (err) {
          console.error('error: ', err.message);
          assert.equal(err.message, null);
        }

        connections.push(connection);

        if (connectionIndex == connectCount) {
          closeConnections(connections);
        }
      });
    })(x);
  }
}

function closeConnections (connections) {
  pool.close(function () {
    console.error('pool closed');
  });
}

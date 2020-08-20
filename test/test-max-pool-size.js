var common = require("./common")
	, informixdb = require("../")
	, pool = new informixdb.Pool()
	, connectionString = common.connectionString
    , assert = require("assert")
	, connections = []
	, connectCount = 12;

//informixdb.debug(true);
pool.setMaxPoolSize(9); // Max no of active connections.
pool.setConnectTimeout(5); // Connection timeout in seconds.
var ret = pool.init(6, connectionString); // Initialize pool with n no of connections.
assert.deepEqual(true, ret);

openConnectionsUsingPool(connections);

function openConnectionsUsingPool(connections) {
  for (var x = 1; x <= connectCount; x++) {
   (function (connectionIndex) {
      console.error("Opening connection #", connectionIndex);
      pool.open(connectionString, function (err, connection) {
        if (err) {
          console.error("error for connection %d: %s", 
              connectionIndex, err.message);
          if (connectionIndex == connectCount) {
            console.log("Going to close connections.. \n");
            closeConnections(connections);
          }
          return false;
        }

        connections.push(connection);
        console.log("connection " + connectionIndex + " opened.\n");

        if (connectionIndex == connectCount) {
          console.log("Going to close connections.. \n");
          closeConnections(connections);
        }
      });
    })(x);
  }
}

function closeConnections (connections) {
  pool.close(function () {
    console.error("pool closed");
  });
}



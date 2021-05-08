const domain = require('domain');

const d = domain.create();

d.on('error', function (error) {
  console.log('Error caught!', error);
});

d.run(function () {
  const db = require('../')();

  console.trace();

  db.open('wrongConnectionString', function (error) {
    console.trace();

    // throw new Error();
  });
});

'use strict';

const Promise = require('bluebird');

// Now all functions will return promises. Can also use a module like "pify"
const yrno = Promise.promisifyAll(
  require('../index.js')({
    request: {
      timeout: 25000
    }
  })
);

// Note the "Async" added to use teh promise version
yrno.locationforecastAsync({
  query: {
    lat: 53.3478,
    lon: 6.2597
  },
  version: 1.9
})
   .then((xml) => {
    console.log('weather xml is - ', xml);
  })
  .catch((err) => {
    console.log('failed to get weather', err);
  });

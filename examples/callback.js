'use strict';

const yrno = require('../index.js')({
  request: {
    timeout: 25000
  }
});

yrno.locationforecast({
  query: {
    // Get weather for Dublin, Ireland
    lat: 53.3478,
    lon: 6.2597
  },

  // The locationforecast API version to call
  version: 1.9
}, function (err, xml) {
  if (err) {
    console.log('failed to get weather', err);
  } else {
    console.log('weather xml is - ', xml);
  }
});

'use strict';

const fs = require('fs');
const path = require('path');
const yrno = require('../index.js')({
  request: {
    timeout: 25000
  }
});

// response data will be written to a file called res.xml in the
// same directory as this script
const filepath = path.join(__dirname, 'data', 'weather.xml');

yrno.locationforecast({
  query: {
    lat: 53.3478,
    lon: 6.2597
  },
  version: 1.9
})
  .pipe(fs.createWriteStream(filepath))
  .on('finish', () => {
    console.log(`\nopen the file at ${filepath} to see the weather xml\n`);
  });

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
const filepath = path.join(__dirname, 'data', 'radar.gif');

yrno.radar({
  query: {
    radarsite: 'central_norway',
    type: 'reflectivity',
    content: 'animation',
    size: 'normal'
  },
  version: 1.5
})
  .pipe(fs.createWriteStream(filepath))
  .on('finish', () => {
    console.log(`\nopen the file at ${filepath} to see the radar animation\n`);
  });

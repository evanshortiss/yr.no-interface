var assert = require('assert');
var api = require('../index.js');
var fs = require('fs');

var FILENAME = 'r-e-s.txt';
var DUBLIN = {
  lat: 53.3478,
  lon: 6.2597
};

describe('Test location forecast function', function() {
  this.timeout(10000);

  it('Should return response from API using default version', function(done) {
    api.locationforecast(DUBLIN, function(err, weather) {
      assert(!err);
      assert(weather);
      done();
    });
  });

  it('Should pipe response to file', function(done) {
    var stream = fs.createWriteStream(FILENAME);
    stream.on('close', function() {
      fs.unlink('./'+FILENAME);
      done();
    });
    api.locationforecast(DUBLIN, stream);
  })
})
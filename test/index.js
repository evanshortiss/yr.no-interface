var assert = require('assert')
  , path = require('path')
  , api = require('../index.js')
  , fs = require('fs');

var FILENAME = path.join(__dirname, './r-e-s.txt');
var VER = 1.9;
var DUBLIN = {
  lat: 53.3478,
  lon: 6.2597
};

before(function (done) {
  fs.unlink(FILENAME, function () {
    done();
  });
});

after(function (done) {
  fs.unlink(FILENAME, function () {
    done();
  });
});

describe('yr.no-interface', function() {
  this.timeout(10000);

  it('Should return response from API', function (done) {
    api.locationforecast(DUBLIN, VER, function(err, weather) {
      assert(!err);
      assert.notEqual(weather, '');
      assert.notEqual(weather.indexOf('weatherdata'), -1);
      done();
    });
  });

  it('Should work without params', function (done) {
    api.forestfireindex(1.1, function(err, weather) {
      assert(!err);
      assert.notEqual(weather, '');
      assert.notEqual(weather.indexOf('weatherdata'), -1);
      done();
    });
  });

  it('Should pipe response to file', function (done) {
    var s = fs.createWriteStream(FILENAME);
    s.on('close', function () {
      var weather = fs.readFileSync(FILENAME, {
        encoding: 'utf8'
      });

      assert.notEqual(weather, '');
      assert.notEqual(weather.indexOf('weatherdata'), -1);

      done();
    });

    api.locationforecast(DUBLIN, VER).pipe(s);
  })
})

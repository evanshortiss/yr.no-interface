var assert = require('assert');
var api = require('../index.js');

var DUBLIN = {
  lat: 53.3478,
  lon: 6.2597
};

describe('Test location forecast function', function() {
  this.timeout(10000);

  // it('getForecastForTime(), Should return a valid forecast object', function(done) {
  //   api.locationForecast(DUBLIN, function(err, weather) {
  //     assert(!err);
  //     assert(typeof weather === 'object');
  //     weather.getForecastForTime(new Date(), function(err, res) {
  //       assert(!err);
  //       assert(res);
  //       done();
  //     });
  //   });
  // });

  // it('getCurrentSummary(), Should return the current weather', function(done) {
  //   api.locationForecast(DUBLIN, function(err, weather) {
  //     assert(typeof weather === 'object');
  //     weather.getCurrentSummary(function(err, res) {
  //       assert(!err);
  //       assert(res);
  //       done();
  //     });
  //   });
  // });

  it('getFiveDaySummary(), Should return 5 days of weather', function(done) {
    api.locationForecast(DUBLIN, function(err, weather) {
      assert(!err);
      assert(weather);
      weather.getFiveDaySummary(function(err, res) {
        console.log(err);
        assert(!err);
        assert(res);

        console.log(res);
        done();
      });
    });
  });
})
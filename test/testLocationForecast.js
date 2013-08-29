var assert = require('assert');
var api = require('../index.js');

describe('Test location forecast function', function() {
  this.timeout(10000);

  it('getForecastForTime(), Should return a valid forecast object', function(done) {
    api.locationForecast({
      lat: 52.25227,
      lon: -7.127205999
    }, function(err, weather) {
      assert(!err);
      assert(typeof weather === 'object');
      weather.getForecastForTime(new Date(), function(err, res) {
        assert(!err);
        assert(res);
        done();
      });
    });
  });

  it('getCurrentSummary(), Should return the current weather', function(done) {
    api.locationForecast({
      lat: 52.25227,
      lon: -7.127205999
    }, function(err, weather) {
      assert(typeof weather === 'object');
      weather.getCurrentSummary(function(err, res) {
        assert(!err);
        assert(res);
        done();
      });
    });
  });

  it('getFiveDaySummary(), Should return 5 days of weather', function(done) {
    api.locationForecast({
      lat: 52.25227,
      lon: -7.127205999
    }, function(err, weather) {
      assert(!err);
      assert(weather);
      weather.getFiveDaySummary(function(err, res) {
        console.log(err, res);
        assert(!err);
        assert(res);
        done();
      });
    });
  });
})
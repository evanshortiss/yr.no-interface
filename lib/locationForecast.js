/**
 * lib/locationForecast.js
 * Provides forecast for location specified by lat, long and meters above sea level
 */

var apiRequest = require('./apiRequest.js'),
  async = require('async'),
  moment = require('moment'),
  URLS = require('./urls.js');

module.exports = getWeather;

/**
 * Class to represent forecast at a high level.
 *
 */

function LocationForecast(json, xml, current) {
  this.hourlies = [];
  this.summaries = [];
  this.json = json;
  this.xml = xml;
  this.current = current;
}

LocationForecast.prototype = {
  getJson: function() {
    return this.json;
  },

  getXml: function() {
    return this.xml;
  },

  getCurrentSummary: function(callback) {
    this.getForecastForTime(moment(), function(err, res) {
      if (err) {
        return callback(err, res);
      }

      return callback(null, res);
    });
  },

  getFiveDaySummary: function(callback) {
    var self = this;
    var fns = [];

    // Use miday for forecast
    var curDate = moment();
    curDate.hours('12');

    // Create 5 days of dates
    for (var i = 0; i < 5; i++) {
      // Avoid scope error for wrong day reference
      (function() {
        var day = curDate.clone();
        day.days(day.days() + i);
        fns.push(function(cb) {
          self.getForecastForTime(day, function(err, weather) {
            if (err) {
              return cb(err, null);
            }

            return cb(null, weather);
          })
        });
      })()

    }

    // Run tasks and return weather array
    async.series(fns, function(err, res) {
      if (err) {
        return callback(err, null);
      }

      return callback(null, res);
    });
  },

  getForecastForTime: function(time, callback) {
    var self = this;
    time = moment(time);
    if (time.isValid() === false) {
      return callback({
        msg: 'Invalid date provided for weather lookup. Date: ' + time.toString()
      });
    }

    var summary = null;
    var hourly = null;

    async.forEach(this.summaries, function(curSummary, cb) {
      if (moment(curSummary.from).isBefore(time) && moment(curSummary.to).isAfter(time)) {
        summary = curSummary;
      }
      cb();
    }, function(err) {
      if (summary == null) {
        return callback({
          msg: 'No weather summary for time ' + time.toJSON()
        }, null);
      }

      async.forEach(self.hourlies, function(curHour, cb) {
        var t = time.clone();
        t.endOf('hour');
        // Round to nearest hour
        t.milliseconds(t.milliseconds() + 1);

        // Normalise time from yr.no
        var from = moment(curHour.from);
        // from.minutes(from.zone());

        // Hourlies to and from are the same, so just check from.
        // Dirty hack to check +1 hour, need to find out why it somtimes fails
        if (from.isSame(t) || moment(from.hours(from.hours() + 1).isSame(t))) {
          hourly = curHour;
        }
        cb();
      }, function(err) {
        if (hourly == null) {
          return callback({
            msg: 'No weather hourly for time ' + time.toJSON() + ' (formatted ' + time.endOf('hour').milliseconds(time.milliseconds() + 1).toJSON() + ')'
          }, null);
        }

        // Build response
        var res = {
          icon: summary['location']['symbol']['id'],
          to: summary['to'],
          from: summary['from'],
          rain: (summary['location']['precipitation']['value'] + ' ' + summary['location']['precipitation']['unit']),
          temperature: hourly['location']['temperature']['value'],
          windSpeed: hourly['location']['windSpeed']['mps'] + 'm/s',
          windBearing: hourly['location']['windDirection']['deg'],
          beaufort: hourly['location']['windSpeed']['beaufort'],
          cloudCover: hourly['location']['cloudiness']['percent'],
          humidity: hourly['location']['humidity']['value'] + '%',
          pressure: hourly['location']['pressure']['value'] + ' ' + hourly['location']['pressure']['unit']
        };

        return callback(null, res);
      });
    });
  }
};



function getWeather(params, callback) {
  apiRequest(params, URLS.LOCATION_FORECAST, function(err, json, xml) {
    if (err) {
      return callback(err, null);
    }

    var current = json['weatherdata']['product']['time'][0];
    current.symbol = json['weatherdata']['product']['time'][1]['symbol'];

    var forecast = new LocationForecast(json, xml, current);
    async.forEach(json['weatherdata']['product']['time'], function(time, cb) {
      // Forecast data with a symbol is a basic summary
      if (time['location']['symbol']) {
        forecast.summaries.push(time);
      } else {
        forecast.hourlies.push(time);
      }
      cb();
    }, function(err) {
      if (err) {
        return callback(err);
      }

      return callback(err, forecast);
    });
  });
};
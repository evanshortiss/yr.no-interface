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

  /**
   * Search for a matching hourly/summary.
   * @param {Array}     collection
   * @param {Mixed}     time
   * @param {Function}  callback
   */
  _getForTime: function(collection, time, closestMatch, callback) {
    // Convert time to moment object
    time = moment(time);
    // Storage for returned val
    var nearestSummary = null;

    if (!callback) {
      callback = closestMatch;
      closestMatch = false;
    }

    // Loop over summaries and find one for time specified
    async.forEach(collection, function(curSummary, cb) {
      var from = moment(curSummary.from),
        to = moment(curSummary.to);

      // Check is time in between summaries
      if ((from.isBefore(time) || from.isSame(time)) && (to.isAfter(time) || to.isSame(time))) {
        // Close enough, return it.
        if (!closestMatch) {
          return cb(curSummary);
        }
        // See is this summary a smaller time range than previous, if so use it.
        else if (nearestSummary && closestMatch) {
          var nearestRange = Math.abs(moment(nearestSummary.to).diff(moment(nearestSummary.from)));
          var curRange = Math.abs(moment(curSummary.to).diff(moment(curSummary.from)))
          if (nearestRange > curRange) {
            nearestSummary = curRange
          }
        } else {
          nearestSummary = curSummary;
        }
      }

      cb();
    }, function(summary) {
      if (summary) {
        return callback(null, summary);
      }

      return callback(null, nearestSummary);
    });
  },


  /**
   * Get a summary for a specific time.
   * @param {Mixed}     time
   * @param {Boolean}   [closestMatch]
   * @param {Function}  callback
   */
  getSummaryForTime: function(time, closestMatch, callback) {
    this._getForTime(this.summaries, time, closestMatch, callback);
  },


  /**
   * Get a hourly for a specific time.
   * @param {Mixed}     time
   * @param {Boolean}   [closestMatch]
   * @param {Function}  callback
   */
  getHourlyForTime: function(time, closestMatch, callback) {
    // this._getForTime(this.hourlies, time, closestMatch, callback);

    var nearestHour = null;
    async.forEach(this.hourlies, function(curHour, cb) {
      var t = time.clone();
      t.endOf('hour');
      // Round to nearest hour
      t.milliseconds(t.milliseconds() + 1);

      // Normalise time from yr.no
      var from = moment.utc(curHour.from);
      // from.minutes(from.zone());

      // Hourlies to and from are the same, so just check from.
      // Dirty hack to check +1 hour, need to find out why it somtimes fails
      // Check is time in between summaries
      if (from.isSame(t)) {
        // Close enough, return it.
        if (!closestMatch) {
          return cb(curHour);
        }
        // See is this summary a smaller time range than previous, if so use it.
        else if (nearestHour && closestMatch) {
          var nearestRange = Math.abs(moment(nearestHour.to).diff(moment(nearestHour.from)));
          var curRange = Math.abs(moment(curHour.to).diff(moment(curHour.from)))
          if (nearestRange > curRange) {
            nearestHour = curRange
          }
        } else {
          nearestHour = curHour;
        }
      }
      cb();
    }, function(h) {
      if (h) {
        return callback(null, h);
      }

      return callback(null, nearestHour);
    });
  },


  /**
   * Get basic summary for current time.
   * @param {Function} callback
   */
  getCurrentSummary: function(callback) {
    this.getForecastForTime(moment(), callback);
  },


  /**
   * Get the forecast for next five days.
   * @params {Function} callback
   */
  getFiveDaySummary: function(callback) {
    var self = this;
    var fns = [];
    // Use miday for forecast
    var curDate = moment.utc();

    // Create 5 days of dates
    for (var i = 0; i < 5; i++) {
      // Avoid scope error for wrong day reference
      (function() {
        var day = curDate.clone();
        day = day.add('days', i);
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
    time.minutes(time.zone());
    if (time.isValid() === false) {
      return callback({
        msg: 'Invalid date provided for weather lookup. Date: ' + time.toString()
      });
    }

    this.getSummaryForTime(time, true, function(err, summary) {
      if (!summary) {
        // console.log(self.summaries);
        return callback({
          msg: 'No weather summary for time ' + time.toJSON()
        }, null);
      }

      var res = {
        icon: summary['location']['symbol']['id'],
        to: summary['to'],
        from: summary['from'],
        rain: (summary['location']['precipitation']['value'] + ' ' + summary['location']['precipitation']['unit'])
      };

      self.getHourlyForTime(time, true, function(err, hourly) {
        if (hourly) {
          // Build response
          res.temperature = hourly['location']['temperature']['value'];
          res.windSpeed = hourly['location']['windSpeed']['mps'] + 'm/s';
          res.windBearing = hourly['location']['windDirection']['deg'];
          res.beaufort = hourly['location']['windSpeed']['beaufort'];
          res.cloudCover = hourly['location']['cloudiness']['percent'];
          res.humidity = hourly['location']['humidity']['value'] + '%';
          res.pressure = hourly['location']['pressure']['value'] + ' ' + hourly['location']['pressure']['unit'];
        }

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
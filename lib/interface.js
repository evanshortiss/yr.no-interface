/**
 * lib/locationForecast.js
 * Provides forecast for location specified by lat, long and meters above sea level
 */

var apiRequest = require('./apiRequest.js'),
  urls = require('./urls.js');

module.exports = {
  locationforecast: locationforecast
};

/**
 * Publically exposed function to get weather object.
 * @param {Object}    params
 * @param {Function}  callback
 * @param {String}    [version]
 */
function locationforecast(params, callback, version) {
  return apiRequest(params, urls.resolveUrl('locationforecast', version), callback);
}


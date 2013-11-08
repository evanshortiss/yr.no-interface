/**
 * Interface to call methods on the API
 * All functions can be passed a stream instead of a callback
 */

module.exports = {
  locationforecast: locationforecast
};

var apiRequest = require('./apiRequest.js'),
  urls = require('./urls.js');
  

/**
 * Publically exposed function to get weather object.
 * @param {Object}    params
 * @param {Mixed}     callback
 * @param {String}    [version]
 */
function locationforecast(params, callback, version) {
  return apiRequest(params, urls.resolveUrl('locationforecast', version), callback);
}


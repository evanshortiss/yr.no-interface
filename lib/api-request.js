'use strict';

const log = require('debug')(require('../package.json').name);
const request = require('request');
const VError = require('verror');

/**
 * Make a request to the met.no API and handle the response.
 * Alternatively, if no callback is supplied, return the stream.
 * @param  {Object}   opts
 * @param  {Function} callback
 * @return {ReadableStream|undefined}
 */
module.exports = function performYrNoApiRequest (opts, callback) {
  log('perform http request with opts %j', opts);

  // Pipe instead
  if(typeof callback !== 'function') {
    log('no callback passed so returning request object for piping');
    return request(opts);
  }

  request(opts, function (err, res, body) {
    var sc = res && res.statusCode;

    if (err) {
      log('received an error when making http request', err);
      return callback(
        new VError(
          err,
          'request to met.no encountered an error'
        ),
        null
      );
    } else if (sc === 203 || sc === 200) {
      log('received status code %s, request was a success', sc);
      return callback(null, body);
    } else {
      log('received status code %s, request was a  failure', sc);
      return callback(
        new VError(
          'met.no API call failed. received %s status and response body %j',
          sc,
          res.body
        )
      );
    }
  });
}

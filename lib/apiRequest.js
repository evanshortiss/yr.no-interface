'use strict';

var request = require('request');


/**
 * Perform a GET request to the API
 * @param {Object}    params
 * @param {String}    url
 * @param {Function}  callback
 */
module.exports = function (params, url, callback) {
  // Pipe instead
  if(typeof callback !== 'function') {
    return request({
      url: url,
      timeout: 60000,
      qs: params
    });
  }

  return request({
    url: url,
    timeout: 60000,
    // headers: {
    //   'Accept-Encoding': 'gzip'
    // },
    qs: params
  }, function(err, res, body) {
    var sc = res && res.statusCode;

    if (err) {
      return callback(err, null);
    } else if (sc === 203 || sc === 200) {
      return callback(null, body);
    } else {
      return callback({
        body: body,
        statusCode: sc || 'No response received'
      });
    }
  });
};

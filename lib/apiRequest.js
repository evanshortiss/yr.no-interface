var request = require('request');

module.exports = doRequest;

/**
 * Perform a GET request to the API
 * @param {Object}    params
 * @param {String}    url
 * @param {Function}  callback
 */
function doRequest(params, url, callback) {
  // Pipe instead
  if(typeof callback != 'function') {
    return pipe(params, url, callback);
  }

  return request({
    url: url,
    qs: params,
  }, function(err, res, body) {
    if(err) {
      return callback(err, null);
    }

    if(res.statusCode != 200) {
      return callback({
        body: body,
        statusCode: res.statusCode,
      })
    }

    return callback(null, body);
  });
}


/**
 * Used to setup a pipe for request.
 * @param {Stream} stream
 */
function pipe(params, url, stream) {
  return request({
    url: url,
    qs: params
  }).pipe(stream);
}
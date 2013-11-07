/**
 * lib/apiRequest.js
 * Generic request handler for API calls, returns JSON parsed from XML
 */

var request = require('request'),
  xml2js = require('xml2js');

var parser = new xml2js.Parser({
  async: true,
  mergeAttrs: true,
  explicitArray: false
});

module.exports = {
  pipe: pipe,
  get: get
};

/**
 * Perform a GET request to the API
 * @param {Object}    params
 * @param {String}    url
 * @param {Function}  callback
 */
function get(params, url, callback) {
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
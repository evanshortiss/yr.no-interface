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

module.exports = function(params, url, callback) {
  request({
    url: url,
    qs: params,
  }, function(err, res, body) {
    if(err) {
      return callback(err, null);
    }

    if(res.statusCode != 200) {
      return callback({
        msg: "No data available for request",
        statusCode: res.statusCode
      });
    }

    parser.parseString(body, function(err, res) {
      if(err) {
        return callback(err, null);
      }

      return callback(null, res, body);
    });
  })
};
'use strict';

var apiRequest = require('./apiRequest.js')
  , endpoints = require('./endpoints')
  , path = require('path')
  , url = require('url')
  , assert = require('assert')
  , HOST = 'http://api.yr.no'
  , PATH = '/weatherapi/';

// Build API functions
for(var i = 0; i < endpoints.length; i++) {

  // Wrap in closure to prevent value of fn from being modified
  (function () {
    var fn = endpoints[i].toLowerCase();

    exports[fn] = function (params, version, callback) {
      // Support no params being provided
      if (typeof params === 'number') {
        callback = version;
        version = params;
        params = {};
      }

      version = parseFloat(version);
      assert.equal(isNaN(version), false, '"version" must be a number');

      version.toFixed(1);
      assert.equal(typeof version, 'number', '"version" param is required.');

      // Build path and url
      var p = path.join(PATH, fn, version.toString())
        , u = url.resolve(HOST, p);

      return apiRequest(params, u, callback);
    };
  })();

}

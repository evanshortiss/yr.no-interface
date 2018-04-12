'use strict';

const url = require('url');
const log = require('debug')(require('./package.json').name);
const performYrNoApiRequest = require('./lib/api-request');
const endpoints = require('./lib/endpoints');

const HOST = 'https://api.met.no';
const PATH = '/weatherapi';


/**
 * Main export for this module. Creates api wrapper instances
 * @param  {Object} config
 * @return {Object}
 */
module.exports = (config) => {
  log('creating yr.no-interface with config', config);

  config = Object.assign({
    request: {
      timeout: 60000
    }
  }, config);

  const api = {};

  // Build API functions
  for (let i = 0; i < endpoints.length; i++) {
    // Wrap in closure to prevent value of fn from being modified
    (function () {
      const fn = endpoints[i].toLowerCase();

      api[fn] = (params, callback) => {
        params = Object.assign({}, config, params);

        if (!params.version) {
          const e = new Error('params.version is a required config required for api calls');
          if (callback) {
            callback(e);
          } else {
            throw e;
          }
        } else {

          // console.log('xxx', url.resolve(HOST, `${PATH}/${fn}/${params.version}`))
          const requestOpts = Object.assign({}, config.request, params.request, {
            url: url.resolve(HOST, `${PATH}/${fn}/${params.version}`),
            qs: params.query
          });

          log('performing "%s" with request params %j', fn, requestOpts);

          // just in case someone supplied it in config.request...
          delete requestOpts.uri;

          return performYrNoApiRequest(requestOpts, callback);
        }
      };
    })();
  }

  return api;
};

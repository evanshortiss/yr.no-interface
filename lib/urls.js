/**
 * Contains methods for building and interacting with API urls.
 */

module.exports = {
  setDefaultVersion: setDefaultVersion,
  resolveUrl: resolveUrl
};


var BASE_URL = 'http://api.yr.no/weatherapi';
var urls = {
  'locationforecast': {
    path: '/locationforecast/',
    defVer: '1.8'
  }
};


/**
 * Provided params resolve a URL with version.
 * @param {String} service
 * @param {String} ver
 * @return {String}
 */
function resolveUrl(service, ver) {
  service = service.toLowerCase();
  ver = ver || urls[service].defVer;

  return BASE_URL + urls[service].path + ver;
}


/**
 * Set the default version to use for a service.
 * @param {String} service
 * @param {String} ver
 */

function setDefaultVersion(service, ver) {
  service = service.toLowerCase();
  return urls[service].defVer = ver;
}
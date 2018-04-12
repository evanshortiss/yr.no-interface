yr.no-interface
===============

![TravisCI](https://travis-ci.org/evanshortiss/yr.nno-interface.svg) [![npm version](https://badge.fury.io/js/yr.no-interface.svg)](https://badge.fury.io/js/yr.no-interface) [![Coverage Status](https://coveralls.io/repos/github/evanshortiss/yr.no-interface/badge.svg?branch=master)](https://coveralls.io/github/evanshortiss/yr.no-interface?branch=master)

HTTP request wrapper for the yr.no/api.met.no weather service API with support
for streams.

## Install

```
npm install yr.no-interface --save
```

## Examples

All of these are in the [/examples](github.com/evanshortiss/yr.no-interface/tree/master/examples)
folder of this project.

### Callback Example

```javascript
const yrno = require('yr.no-interface')({
  request: {
    timeout: 25000
  }
});

yrno.locationforecast({
  query: {
    // Get weather for Dublin, Ireland
    lat: 53.3478,
    lon: 6.2597
  },

  // The locationforecast API version to call
  version: 1.9
}, function (err, xml) {
  if (err) {
    // Something went wrong...
  } else {
    // We got an XML response!
  }
});
```


### Streaming Example
Streams are one of the most powerful features in node.js. They allow you to
perform I/O while using a tiny amount of memory since they pass data through the
process in small "chunks".

Using streams is useful for certain response types such as the `radar` API since
it returns a large GIF file that could use a large amount of the node.js process
memory if loaded into a callback

Below we use a stream to pipe the HTTP respone from the yr.no API to a file on
our machine.

```javascript
const fs = require('fs');
const path = require('path');
const yrno = require('yr.no-interface')({
  request: {
    timeout: 25000
  }
});

// response data will be written to a file called res.xml in the
// directory this script is being run from
const filepath = path.join(process.cwd(), 'weather.xml');

yrno.locationforecast({
  query: {
    lat: 53.3478,
    lon: 6.2597
  },
  version: 1.9
})
  .pipe(fs.createWriteStream(filepath));
```

### Promises Example
This module does not support promises by default. Here's how you could get
Promise support:

```js
const Promise = require('bluebird');

// Now all functions will return promises. Can also use a module like "pify"
const yrno = Promise.promisifyAll(
  require('yr.no-interface')({
    request: {
      timeout: 25000
    }
  })
);

// Note the "Async" added to use teh promise version
yrno.locationforecastAsync({
  query: {
    lat: 53.3478,
    lon: 6.2597
  },
  version: 1.9
})
   .then((xml) => {
    console.log('weather xml is - ', xml);
  })
```

## API

### module
This module exports a single function that must be called to get an API wrapper.

```js
// Get an API wrapper instance with a default request timeout of 25 seconds
const yrno = require('yr.no-interface')({
  request: {
    // Can pass anything supported by the request module here.
    // Passing "qs" or "url" will fail since the module will overwrite them
    timeout: 25000
  }
});
```

Returns an API `instance`.

## instance

An instance is an object with functions attached. The functions are listed
below.

## instance.FUNCTION

All functions on an `instance` contain the same signature of
_yrno.func([params[, callback])_, e.g `yrno.locationforecast(params, callback)`.

_callback_ is optional. If no callback is provided a stream is returned so you
can use node's stream awesomeness to pass data around. _params_ should contain
the querystring params as specified at the
[yr.no docs](api.met.no/weatherapi/documentation).

Each request must specify `params.version` as the met.no API requires this.

## instance functions

* errornotifications
* extremeforecast
* extremesWWC
* forestfireindex
* geosatellite
* gribfiles
* icemap
* lightning
* locationforecast
* locationforecastLTS
* metalerts
* metgm
* mountaineasterobservations
* nowcast
* oceanforecast
* polarsatellite
* probabilityforecast
* radar
* radarlightning
* sigmets
* spotwind
* subjectiveforecast
* sunrise
* tafmetar
* temperatureverification
* textforecast
* textlocation
* tidalwater
* turbulence
* uvforecast
* upperwindweather
* verticalprofile
* weathericon


## Contributors

* @ktrance
* @clux
* @Oisann


## CHANGELOG

* 1.2.0 - Updated to use https://api.met.no instead of the deprecated http://api.yr.no - thanks @antonmarsden

* 1.1.0 - Updated API endpoints to match api.met.no - thanks @ktrance.

* 1.0.1 - Patch for security vulnerability in `request` through `qs` module.

* 1.0.0 - Initial stable release.

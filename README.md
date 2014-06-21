yr.no-interface
===============

Simple request wrapper for the yr.no weather service API.

## API
All functions for the API contain the same signature: 
_yrno.func([params,] version [, callback])_. _params_ and _callback_ are 
optional. If no callback is provided a stream is returned so you can use 
Node's stream awesomeness. _params_ should contain the querystring params as 
specified at the [yr.no docs](http://api.yr.no/weatherapi/documentation).

Each request must specify the version as the API requires this.

## Examples

#### Simple Example

```javascript
var yrno = require('yr.no-intrface'),
	dublin = {
		lat: 53.3478,
		lon: 6.2597
	},
	LOC_VER = 1.9;


yrno.locationforecast(dublin, LOC_VER, function (err, xml) {
	if (err) {
		// Something went wrong...
	} else {
		// We got an XML response!
	}
});
```


#### Streaming Example

```javascript
var yrno = require('yr.no-intrface'),
	fs = require('fs'),
	dublin = {
		lat: 53.3478,
		lon: 6.2597
	},
	LOC_VER = 1.9;


yrno.locationforecast(dublin, LOC_VER).pipe(fs.createWriteStream('./res.xml'));
```
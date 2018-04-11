'use strict';

const chai = require('chai');
const expect = chai.expect;
const proxyquire = require('proxyquire').noCallThru().noPreserveCache();
const sinon = require('sinon');
const fs = require('fs');

chai.use(require('chai-truthy'));

describe('met.no-interface', function() {
  let mod, request, dublin, dublinxml;

  beforeEach(() => {
    dublinxml = fs.readFileSync('fixtures/weather-dublin.xml', 'utf-8');

    dublin = {
      lat: 53.3478,
      lon: 6.2597
    };

    request = sinon.stub();

    mod = proxyquire('../index.js', {
      './lib/api-request': request
    });
  });

  it('should return an API object with bound functions', () => {
    const instance = mod({});

    expect(instance).to.be.an('object');
    expect(instance.locationforecast).to.be.a('function');
  });

  it('should return error to callback if "version" is missing', (done) => {
    const instance = mod({});

    instance.locationforecast({
      query: dublin
    }, (err) => {
      expect(err).to.be.truthy();
      expect(err.toString()).to.contain('params.version is a required config');

      done();
    });
  });

  it('should throw error "version" is missing and no callback supplied', () => {
    const instance = mod({});

    expect(() => {
      instance.locationforecast({
        query: dublin
      });
    }).to.throw();
  });

  it('should use default request params if none are passed', (done) => {
    const instance = mod({});

    request.yields(null, dublinxml);

    instance.locationforecast({
      version: '1.9',
      query: dublin
    }, (err, weather) => {
      expect(err).to.be.falsy();
      expect(weather).to.be.a('string');
      expect(weather).to.equal(dublinxml);

      const args = request.getCall(0).args[0];

      expect(args.url).to.equal('https://api.met.no/weatherapi/locationforecast/1.9');
      expect(args.qs).to.equal(dublin);
      expect(args.timeout).to.equal(60000);

      done();
    });
  });

  it('should use custom request params passed', (done) => {
    const instance = mod({});
    const customTimeout = 1000;

    request.yields(null, dublinxml);

    instance.locationforecast({
      version: '1.9',
      query: dublin,
      request: {
        timeout: customTimeout
      }
    }, (err, weather) => {
      expect(err).to.be.falsy();
      expect(weather).to.be.a('string');
      expect(weather).to.equal(dublinxml);

      const args = request.getCall(0).args[0];

      expect(args.url).to.equal('https://api.met.no/weatherapi/locationforecast/1.9');
      expect(args.qs).to.equal(dublin);
      expect(args.timeout).to.equal(customTimeout);

      done();
    });
  });

  it('should use request params passed in initial config', (done) => {
    const customTimeout = 1050;
    const instance = mod({
      request: {
        timeout: customTimeout
      }
    });

    request.yields(null, dublinxml);

    instance.locationforecast({
      version: '1.9',
      query: dublin
    }, (err, weather) => {
      expect(err).to.be.falsy();
      expect(weather).to.be.a('string');
      expect(weather).to.equal(dublinxml);

      const args = request.getCall(0).args[0];

      expect(args.url).to.equal('https://api.met.no/weatherapi/locationforecast/1.9');
      expect(args.qs).to.equal(dublin);
      expect(args.timeout).to.equal(customTimeout);

      done();
    });
  });
});

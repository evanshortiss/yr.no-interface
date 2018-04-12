'use strict';

const chai = require('chai');
const expect = chai.expect;
const proxyquire = require('proxyquire').noCallThru().noPreserveCache();
const sinon = require('sinon');

chai.use(require('chai-truthy'));

describe('api-request', () => {
  let mod, request, args, xml;

  beforeEach(() => {
    xml = '<xml>test xml string</xml>';

    args = {
      url: 'https://api.met.no',
      qs: {
        lat: 34.37,
        lon: 5.63
      }
    };

    request = sinon.stub();

    mod = proxyquire('lib/api-request', {
      request: request
    });
  });

  it('should call request and return a stream', () => {
    const fakestream = {};

    request.returns(fakestream);

    const stream = mod(args);

    expect(request.calledWith(args)).to.be.truthy();
    expect(stream).to.equal(fakestream);
  });

  it('should pass request errors to the callback', (done) => {
    request.yields(new Error('ETIMEDOUT'));

    mod(args, (err) => {
      expect(request.called).to.be.truthy();
      expect(err.toString()).to.contain('request to met.no encountered an error: ETIMEDOUT');
      done();
    });
  });

  it('should handle 200 responses as a success', (done) => {
    request.yields(null, {statusCode: 200}, xml);

    mod(args, (err, res) => {
      expect(request.called).to.be.truthy();
      expect(err).to.be.falsy();
      expect(res).to.equal(xml);
      done();
    });
  });

  it('should handle 203 responses as a success', (done) => {
    request.yields(null, {statusCode: 203}, xml);

    mod(args, (err, res) => {
      expect(request.called).to.be.truthy();
      expect(err).to.be.falsy();
      expect(res).to.equal(xml);
      done();
    });
  });

  it('should handle other http responses as failures', (done) => {
    request.yields(null, {statusCode: 500, body: 'oh noes!'});

    mod(args, (err) => {
      expect(request.called).to.be.truthy();
      expect(err).to.be.truthy();
      expect(err.toString()).to.contain('met.no API call failed. received 500 status');
      expect(err.toString()).to.contain('oh noes');
      done();
    });
  });
});

const assert = require('chai').assert;
const should = require('chai').should();
const expect = require('chai').expect;

var sl = require('../../lib/SupportedLines.js')();

describe('SupportedLines', function() {
  it('returns an array of objects', function() {
    sl.should.be.an('array')
  });
  it('array should contain objects matching the spec', function() {
    expect(sl[0]).to.contain.all.keys(['name', 'id'])
  });
  it('each object should have correct attributes', function() {
    expect(sl[0]).to.have.property('id')
    .that.is.a('string')
  });
});

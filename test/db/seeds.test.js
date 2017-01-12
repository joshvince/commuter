const assert = require('chai').assert;
const should = require('chai').should();
const expect = require('chai').expect;

var feedbackSchema = require('../../models/feedback.js').schema();
var linesSchema = require('../../models/line.js').schema();
var seedData = require('../../db/seedData.js');

describe('Seeds', function() {
  describe('Feedback', function() {
    it('should follow the same schema as the feedback module', function() {
      seedData.feedbackSeeds.records.forEach(obj => {
        expect(obj).to.include.keys(Object.keys(feedbackSchema))
      })
    });
  });
  describe('Line status', function() {
    it('should follow the same schema as the line module', function() {
      seedData.lineStatusSeeds.records.forEach(obj => {
        expect(obj).to.include.keys(Object.keys(linesSchema))
      })
    });
  });
});

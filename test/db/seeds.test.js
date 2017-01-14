const assert = require('chai').assert;
const should = require('chai').should();
const expect = require('chai').expect;

var feedbackSchema = require('../../models/feedback.js').schema();
var linesSchema = require('../../models/line.js').schema();
var seedData = require('../../db/seedData.js');

describe('Seeds', function() {
  describe('Feedback', function() {
    it('should follow the same schema as the feedback objects', function() {
      seedData.feedbackSeeds.records.forEach(obj => {
        expect(obj).to.include.keys(Object.keys(feedbackSchema))
      })
    });
    it('should seed the table with a key present in the schema', function() {
      var tableObj = seedData.tables.find(obj => {
        return obj.TableName == 'feedback'
      })
      var keyNames = tableObj.KeySchema.map(obj => {
        return obj.AttributeName
      })
      expect(feedbackSchema).to.include.keys(keyNames);
    });
  });
  describe('Line status', function() {
    it('should follow the same schema as the line status objects', function() {
      seedData.lineStatusSeeds.records.forEach(obj => {
        expect(obj).to.include.keys(Object.keys(linesSchema))
      })
    });
    it('should seed the table with a key present in the schema', function() {
      var tableObj = seedData.tables.find(obj => {
        return obj.TableName == process.env.LINE_STATUS_TABLE
      })
      var keyNames = tableObj.KeySchema.map(obj => {
        return obj.AttributeName
      })
      expect(linesSchema).to.include.keys(keyNames);
    });
  });
});

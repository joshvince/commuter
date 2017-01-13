// This module interacts with feedback objects in the database
var db = require('./database.js')
const debug = require('debug')('feedback')

function schema() {
  return {
    lineId: "string",
    scoreArray: [10],
    timestamp: "string",
    display: {},
    feedback: true
  }
}

/*
Creates a basic feedback object for a line status, ready for insertion to the DB.
Data should be valid JSON
*/
function lineStatusFeedbackObj(data){
  return {
    lineId: data.line.id,
    scoreArray: data.raw,
    timestamp: data.feedback.timestamp,
    display: data.display,
    feedback: data.feedback.feedback
  }
}

function writeToDb(data) {
  var obj = lineStatusFeedbackObj(data)
  db.write(obj, 'feedback')
}

module.exports = {
  schema: schema,
  writeToDb: writeToDb
};

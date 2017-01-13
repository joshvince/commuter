// THIS MODULE HANDLES REQUESTS FOR THE LINE'S SCORE, WHICH COME FROM THE CLIENT
const debug = require('debug')('LineStatus')
var Line = require('../models/line.js')
var Tfl = require('./Tfl.js')

// Hardcoding this temporarily -- this module will probably always use this. Might want to move out into an env var.
var dbTableName = 'line-status'

var serviceDescriptions = require('./serviceDescriptions.js')

/*
Performs two async tasks:
Grabs the latest status code from TFL.
Also, gets the scoreArray from the line object in the DB.
When both tasks are complete, it then builds the response object and returns it.
See buildResponseObject for details on what looks like.
*/
function getStatus(lineId) {
  var tasks = [
    Tfl.getStatusFromTfl(lineId),
    Line.getScoreArray(lineId, dbTableName)
  ]
  return Promise.all(tasks).then(responses => {
    return buildResponseObject(responses)
  })
}

/*
Turns the raw response from TFL and the raw string of statuses from the DB
into a response object ready to be consumed by the client.
`rawArray` should contain two items:
An integer at pos 0
A parsable array of integers at pos 1

This function does some parsing of its own and returns an object
*/
function buildResponseObject(rawArray) {
  var currentCode = rawArray[0]
  var historyArray = JSON.parse(rawArray[1])
  return {
    current: serviceDescriptions.byCode(currentCode),
    lastHour: scoreLastHour(historyArray),
    raw: [currentCode, historyArray]
  }
}

function scoreLastHour(scoreArray){
  var score =
    scoreArray.map((el) => {
      return mapSeverityScore(el)
    })
    .reduce((acc, curr) => {
      return acc + curr
    }, 0)
  return scoreToText(score)
}

function mapSeverityScore(value){
  var closure = [1,2,3,4,5,8,11,16,20],
  severe = [6,7,14,15,17],
  minor = [9],
  good = [10,12,13,18,19]

  if (closure.includes(value)) {
    return 3
  }
  else if(severe.includes(value)){
    return 2
  }
  else if(minor.includes(value)){
    return 1
  }
  else {
    return 0
  }
}

function scoreToText(score) {
  if (score < 1) { return "No problems"}
  if (score < 9) { return "Some problems"}
  if (score < 20) { return "Lots of problems"}
  if (score < 35) { return "Severe problems"}
  if (score == 36) { return "Closed"}
}

module.exports = {
  getStatus: getStatus
}

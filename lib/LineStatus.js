// THIS MODULE HANDLES REQUESTS FOR THE LINE'S SCORE, WHICH COME FROM THE CLIENT
const debug = require('debug')('LineStatus')
var Line = require('../models/line.js')
var Tfl = require('./Tfl.js')

// Hardcoding this temporarily -- this module will probably always use this.
// Might want to move out into an env var.
var dbTableName = process.env.LINE_STATUS_TABLE

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
  /* this will have arrived as a string from the DB (TODO: fix this!) so it
    needs parsing before we can do anything useful with it */
  var historyArray = JSON.parse(rawArray[1])
  var lastHourMsg = scoreLastHour(historyArray)

  return {
    current: serviceDescriptions.byCode(currentCode),
    lastHour: lastHourMsg,
    raw: [currentCode, historyArray],
    message: createMessage(currentCode, lastHourMsg)
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

function assignSeverityToServiceCodes() {
  return {
    closure: [1,2,3,4,5,8,11,16,20],
    severe: [6,7,14,15,17],
    minor: [9],
    good: [10,12,13,18,19]
  }
}

function mapSeverityScore(value){
  var severity = assignSeverityToServiceCodes()
  if (severity.closure.includes(value)) {
    return 3
  }
  else if(severity.severe.includes(value)){
    return 2
  }
  else if(severity.minor.includes(value)){
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

function createMessage(currentCode, historyMessage) {
  var severity = assignSeverityToServiceCodes()
  var msg = {
    normal: "No busier than usual",
    busy: "Busier than normal",
    muchBusier: "Much busier than normal",
    closed: "Closed"
  }
  if (severity.good.includes(currentCode)) {
    switch (historyMessage) {
      case "No problems":
        return msg.normal
        break;
      case "Some problems":
        return msg.busy
        break;
      default:
        return msg.muchBusier
    }
  }
  else if (severity.minor.includes(currentCode)) {
    switch (historyMessage) {
      case "No Problems":
        return msg.busy
        break;
      case "Some Problems":
        return msg.busy
        break;
      default:
        return msg.muchBusier
    }
  }
  else if (severity.severe.includes(currentCode)) {
    return msg.muchBusier
  }
  else if (severity.closure.includes(currentCode)) {
    return msg.closed
  }
}

module.exports = {
  getStatus: getStatus
}

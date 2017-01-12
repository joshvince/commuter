// THIS MODULE HANDLES REQUESTS FOR THE LINE'S SCORE, WHICH COME FROM THE CLIENT
const debug = require('debug')('LineStatus')
var Line = require('../models/line.js')
var Tfl = require('./Tfl.js')

// Hardcoding this temporarily -- this module will probably always use this. Might want to move out into an env var.
var dbTableName = 'line-status'

var serviceDescriptions = require('./serviceDescriptions.js')

/*
grabs the current status code from TFL and updates the line object in the db.
With updated scoreArray from the db, builds an object containing current and lastHour strings.
This is ready to be consumed by the client.
*/
function getStatus(lineId) {
  return Tfl.updateStatus(lineId).then(res =>{
    return buildResponseObject(JSON.parse(res))
  })
}

function buildResponseObject(array) {
  return {
    current: serviceDescriptions.byCode(array[0]),
    lastHour: scoreLastHour(array),
    raw: array
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

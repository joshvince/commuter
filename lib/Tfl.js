// INTERACTS WITH THE TFL API

// 3rd Party Modules
var request = require('request')
const debug = require('debug')('Tfl')
var cron = require('node-cron')

// Environment Variables
var appKey = process.env.TFL_APP_KEY
var appId = process.env.TFL_APP_ID
var tflServer = process.env.TFL_SERVER
var lineStatusTable = process.env.LINE_STATUS_TABLE
var feedbackTable = process.env.FEEDBACK_TABLE

// Local Modules
var Line = require('../models/line.js')

/*
A cron task that runs every five minutes during the regular tube hours.
Currently: it runs from 5am to midnight.
It takes in an array of Line ids and, for each of them, requests the status
of that line from TFL and updates the object in the DB.
This is exported to server.js so it can be started when the server is.
*/
function schedule(idArray) {
  cron.schedule('*/5 0,5-23 * * *', () =>{
    idArray.forEach(lineId => {
      debug('Polling TFL for ' + lineId + ' at: ' + new Date())
      return updateStatus(lineId)
    })
  })
}

/*
Updates the status of the line supplied in the Commuter DB.
First, gets the status from the api, parses the response to a code and then calls the updateStatus method from Line.js
See docs for updateStatus in Line.js for what this is doing.
*/
function updateStatus(lineId){
  return getStatusFromTfl(lineId).then(code => {
    return Line.updateStatus(code, lineId, lineStatusTable)
  })
}

function getStatusFromTfl(lineId){
  var apiUrl = buildApiUrl(lineId)
  return callApi(apiUrl).then(response => {
    return getCode(response)[0]
  })
}

/*
Depending on the TFL_SERVER environment variable, this function builds a url to the tfl/fake api
*/
function buildApiUrl(lineId){
  return `${tflServer}/Line/${lineId}/Status?detail=True&app_id=${appId}&app_key=${appKey}`
}

function callApi(url){
  return new Promise((resolve, reject) =>{
    request(url, (err, res, body) => {
      if (!err && res.statusCode == 200) {
        resolve(body);
      }
      else {
        reject(err)
      }
    })
  })
}

// TODO: Document why are we just asking for the first element in this array.

function getCode(response){
  return JSON.parse(response)[0].lineStatuses
  .map(el => { return el.statusSeverity })
}

module.exports = {
  schedule: schedule,
  updateStatus: updateStatus,
  getStatusFromTfl: getStatusFromTfl
}

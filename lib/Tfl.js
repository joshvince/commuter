// INTERACTS WITH THE TFL API

var request = require('request')
const debug = require('debug')('Tfl')
var appKey = process.env.TFL_APP_KEY
var appId = process.env.TFL_APP_ID
var tflServer = process.env.TFL_SERVER
var Line = require('../models/line.js')

/*
POLLS THE TFL API EVERY FIVE MINUTES.
FETCHES THE CURRENT STATUS OF THE LINE AND UPDATES THE RECORD IN THE DB (SEE UPDATESTATUS FOR DETAILS)
BY DEFAULT, THIS IS EXPORTED TO THE SERVER.JS FILE SO IT CAN BE STARTED WHEN THE SERVER STARTS.
*/
function poll(lineId){
  setInterval(function(){
    debug('The time is: ' + new Date())
    return updateStatus(lineId)
  }, 30000)
}

/*
Updates the status of the line supplied in the Commuter DB.
First, gets the status from the api, parses the response to a code and then calls the updateStatus method from Line.js
See docs for updateStatus in Line.js for what this is doing.
*/
function updateStatus(lineId){
  return getStatusFromTfl(lineId).then(code => {
    return Line.updateStatus(code, lineId, 'line-status')
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
  poll: poll, 
  updateStatus: updateStatus
}


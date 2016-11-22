// LineStatus
// Gets the status of the line requested

var request = require('request')
// require('request-debug')(request)
const debug = require('debug')('TubeStatus')
var appKey = process.env.TFL_APP_KEY
var appId = process.env.TFL_APP_ID
var tflServer = process.env.TFL_SERVER
var database = require('../models/database.js')
var Line = require('../models/line.js')

function updateStatus(lineId){
  return getStatusFromTfl(lineId).then(code => {
    return Line.updateStatus(code, lineId, 'line-status')
  })
}

function getStatusFromTfl(lineId){
  return callApi(buildApiUrl(lineId)).then(response => {
    return getCode(response)[0]
  })
}

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

function getCode(response){
  return JSON.parse(response)[0].lineStatuses
  .map(el => { return el.statusSeverity })
}


module.exports = {
  updateStatus: updateStatus
}



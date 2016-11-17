// TubeStatus
// Gets the status of the line requested
var request = require('request')
// require('request-debug')(request)
const debug = require('debug')('TubeStatus')
var supportedLines = require('./SupportedLines.js')
var appKey = process.env.TFL_APP_KEY
var appId = process.env.TFL_APP_ID
var tflServer = process.env.TFL_SERVER

function TubeStatus(lineId){
  return callApi(buildApiUrl(lineId)).then(data => {
    parseResponse(data)
  })
}

function buildApiUrl(lineId){
  return `${tflServer}/Line/${lineId}/Disruption?app_id=${appId}&app_key=${appKey}` 
}



function callApi(url){
  return new Promise(function(resolve, reject){
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

function parseResponse(response){
  return new Promise((resolve, reject) => {
    resolve(JSON.parse(reponse).closureText)
  })
}


module.exports = {
  TubeStatus: TubeStatus
}



// THIS MODULE INTERACTS WITH THE TFL API FOR LINE STATUSES
// IT ALSO HANDLES A REGULARLY SCHEDULED TASK ON THE SERVER, GRABBING THE LATEST STATUS AND UPDATING THE COMMUTER DB
// IT ALSO HANDLES REQUESTS FOR THE LINE'S SCORE, WHICH COME FROM THE CLIENT

var request = require('request')
// require('request-debug')(request)
const debug = require('debug')('TubeStatus')
var appKey = process.env.TFL_APP_KEY
var appId = process.env.TFL_APP_ID
var tflServer = process.env.TFL_SERVER
var database = require('../models/database.js')
var Line = require('../models/line.js')

function run(lineId){
  setInterval(function(){
    debug('The time is: ' + new Date())
    return updateStatus(lineId)
  }, 300000)
}

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


// TODO 
// SEND THIS BACK TO THE CLIENT WHEN THEY HIT THE ENDPOINT


function sendScoreToClient(lineId, tableName){
  return Line.getScoreArray(lineId, tableName).then(res => {
    var arr = JSON.parse(res)
    return scoreLastHour(arr)
  })
}

function scoreLastHour(scoreArray){
  var res = 
    scoreArray.map((el) => {
      return mapSeverityScore(el)
    })
    .reduce((acc, curr) => {
      return acc + curr
    }, 0)
  debug(res)
  return res
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


module.exports = {
  run: run,
  sendScoreToClient: sendScoreToClient,
}



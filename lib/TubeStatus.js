// TubeStatus
// Gets the status of the line requested
var request = require('request')
require('request-debug')(request)
const debug = require('debug')('TubeStatus')
var supportedLines = require('./SupportedLines.js')
var appKey = process.env.TFL_APP_KEY
var appId = process.env.TFL_APP_ID

// function TubeStatus(req, res, next){


// 	function getStatus(lineId){


// 		function callApiAndReturnStatus(url){

// 			function callApi(url){
// 				// RETURNS AN EMPTY ARRAY OR SOMETHING LIKE THIS [{"$type":"Tfl.Api.Presentation.Entities.Disruption, Tfl.Api.Presentation.Entities","category":"RealTime","type":"lineInfo","categoryDescription":"RealTime","description":"Victoria Line: Severe delays due to an earlier signal failure at Brixton. London Underground tickets are being accepted on South West Trains, Southeastern and  local bus services. ","affectedRoutes":[],"affectedStops":[],"closureText":"severeDelays"}]
// 				var res = request(url, (err, res, body) =>{
// 					if (!err && res.statusCode == 200) {
// 						return body
// 					}
// 					else{
// 						return err
// 					}
// 				})
// 				return res
// 			}

// 			function processStatus(statusArray){
// 				if (statusArray == "[]") {
// 					return "Good Service"
					
// 				}
// 				else{
// 					return "Delays..."
// 				}
// 			}

// 			var status = callApi(url)
// 			return processStatus(status)
// 		}
// 		var apiUrl = buildApiUrl(lineId)
// 		return callApiAndReturnStatus(apiUrl)
	
// 	}

// 	var line = getTflLineId(req.originalUrl)

// 	var result = getStatus(line)
// 	console.log("result is \n\n\n" + result)


// 	next()
// }

function TubeStatus(req, res, next){
	let lineId = getTflLineId(req.originalUrl)
	let apiUrl = buildApiUrl(lineId)
	request(apiUrl, (err, res, body) => {
		console.log(body)
	})
}

function getTflLineId(url){
	var lines = supportedLines()
	var urlId = parseInt(url.split("/").pop())
	return lines.filter(el => {return el.id === urlId}).pop().tfl_line_id
}

function buildApiUrl(lineId){
	return `https://api.tfl.gov.uk/Line/circle/Disruption?app_id=${appId}&app_key=${appKey}` 

}

// old verson without promises
function callApi(url){
	// RETURNS AN EMPTY ARRAY OR SOMETHING LIKE THIS [{"$type":"Tfl.Api.Presentation.Entities.Disruption, Tfl.Api.Presentation.Entities","category":"RealTime","type":"lineInfo","categoryDescription":"RealTime","description":"Victoria Line: Severe delays due to an earlier signal failure at Brixton. London Underground tickets are being accepted on South West Trains, Southeastern and  local bus services. ","affectedRoutes":[],"affectedStops":[],"closureText":"severeDelays"}]
	var res = request(url, (err, res, body) =>{
		if (!err && res.statusCode == 200) {
			return body
		}
		else{
			return err
		}
	})
	return res
}

//new version with promises (probably doesn't work.)
function callApi(url){
	return new Promise(function(resolve, reject){
		rerturn request(url, (err, res, body) => {
			if (!err && res.statusCode == 200) { return body }
			else { return err }
		})

		if (status) {
			resolve(status)
		}
		else {
			reject("Oh No result wasn't present!!!!")
		}
	})
}



module.exports = {
	TubeStatus: TubeStatus
}



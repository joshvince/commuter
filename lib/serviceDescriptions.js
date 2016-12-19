
var arr = [
    {"description":"Special Service","code":0},
    {"description":"Closed","code":1},
    {"description":"Suspended","code":2},
    {"description":"Part Suspended","code":3},
    {"description":"Planned Closure","code":4},
    {"description":"Part Closure","code":5},
    {"description":"Severe Delays","code":6},
    {"description":"Reduced Service","code":7},
    {"description":"Bus Service","code":8},
    {"description":"Minor Delays","code":9},
    {"description":"Good Service","code":10},
    {"description":"Part Closed","code":11},
    {"description":"Exit Only","code":12},
    {"description":"No Step Free Access","code":13},
    {"description":"Change of frequency","code":14},
    {"description":"Diverted","code":15},
    {"description":"Not Running","code":16},
    {"description":"Issues Reported","code":17},
    {"description":"No Issues","code":18},
    {"description":"Information","code":19},
    {"description":"Service Closed","code":20}
  ]
function list(){
  return arr
}

function byCode(code) {
  return arr.find(obj => {
    return obj.code == code
  }).description
}

module.exports = {
  list: list,
  byCode: byCode
}

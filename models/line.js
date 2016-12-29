// THIS MODULE INTERACTS WITH LINE OBJECTS IN THE DATABASE
var db = require('./database.js')
const debug = require('debug')('line')

function updateStatus(newValue, itemName, tableName){
  return getScoreArray(itemName, tableName).then(array => {
    return buildScoreArray(newValue, array)
  }).then(newArray => {
    return updateArrayInDb(newArray, itemName, tableName)
  })
}

function getScoreArray(itemId, tableName){
  var item = {id: itemId}
  return db.read(item, tableName).then(data => {
    var array = data.Item.info.scoreArray
    return array
  })
}

function buildScoreArray(newValue, arrayString){
  var array = JSON.parse(arrayString)
  array.unshift(newValue);
  // remove the oldest entry if we have more than 12 entries
  if (array.length > 12) {
    array.pop();
  }
  return array
}

function updateArrayInDb(array, itemId, tableName){
  var item = {id: itemId}
  var stringyArray = JSON.stringify(array)
  var expr = "set info.scoreArray = :s"
  var values = { ":s": stringyArray }
  return db.update(item, expr, values, tableName).then(response => {
    return response.Attributes.info.scoreArray
  })
}

module.exports = {
  buildScoreArray: buildScoreArray,
  updateArrayInDb: updateArrayInDb,
  getScoreArray: getScoreArray,
  updateStatus: updateStatus
}

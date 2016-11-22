var db = require('./database.js')
const debug = require('debug')('line')

function initialise(name){
  return {
    name: name,
    info: {
      scoreArray: null
    }
  }
}

function updateStatus(newValue, itemName, tableName){
  return getScoreArray(itemName, tableName).then(array => {
    return buildScoreArray(newValue, array)
  }).then(newArray => {
    return updateArrayInDb(newArray, itemName, tableName)
  })
}

function getScoreArray(itemName, tableName){
  var item = {name: itemName}
  return db.read(item, tableName).then(data => {
    var array = data.Item.info.scoreArray
    debug("data is: " + JSON.stringify(array, null, 2))
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

function updateArrayInDb(array, itemName, tableName){
  var item = {name: itemName}
  var stringyArray = JSON.stringify(array)
  var expr = "set info.scoreArray = :s"
  var values = { ":s": stringyArray }
  return db.update(item, expr, values, tableName).then(response => {
    console.log(`added to the database. Received this: \n`, JSON.stringify(response))
    return response.Attributes.info.scoreArray
  })
}

module.exports = {
  buildScoreArray: buildScoreArray,
  updateArrayInDb: updateArrayInDb,
  getScoreArray: getScoreArray,
  updateStatus: updateStatus
}
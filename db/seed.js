/*
This module seeds the database with tables and seed values.
It draws the table data and record data from `./seedData.js`
*/
var dotenv = require('dotenv')
dotenv.load()

var seeds = require('./seedData.js');

// NOTE: ensure you have aws-cli on your machine!
var AWS = require('aws-sdk')
// Set the endpoint to your local machine.
AWS.config.update({region: process.env.AWS_REGION, endpoint: process.env.AWS_ENDPOINT});
// Initialise a new database locally
var Dynamo = new AWS.DynamoDB();
// import crud functions
var crud = require('../models/database.js')

function checkForTable(tableData) {
  return new Promise(function(resolve, reject) {
    Dynamo.listTables(function(err, res) {
      if (!err) {
        resolve(res.TableNames.includes(tableData.TableName));
      }
      else {
        console.error(`there was a problem trying to list the tables: `, err)
        reject(err);
      }
    })
  });
}

function destroyTable(tableData) {
  return new Promise(function(resolve, reject) {
    Dynamo.deleteTable(tableData, function(err, data){
      if (err) {
        console.error(`could not delete table. Error JSON: `, JSON.stringify(err, null, 2));
        reject(err)
      }
      else {
        console.log(`Deleted table: ` + JSON.stringify(data, null, 2))
        resolve(data)
      }
    })
  });
}

function createTable(tableData) {
  return new Promise(function(resolve, reject) {
    Dynamo.createTable(tableData, function(err, data){
      if (err) {
        console.error(`Unable to create Table. Error JSON: `, JSON.stringify(err, null, 2));
        reject(err)
      }
      else {
        console.log(`Created table. Table description JSON: `, JSON.stringify(data, null, 2));
        resolve(data)
      }
    })
  });
}

function getRecordsFromSeeds(seedRecords, tableName) {
  var recordsObj = seedRecords.find(obj => {
    return obj.TableName == tableName
  })
  return recordsObj.records
}

function addRecordsToTable(recordsArray, tableName) {
  recordsArray.forEach(obj => {
    crud.write(obj, tableName)
  })
}

function run(seedData) {
  seedData.tables.forEach(table => {
    checkForTable(table).then(exists => {
      if (exists) {
        destroyTable({TableName: table.TableName}).then(msg => {
          createTable(table).then(res => {
            var records = getRecordsFromSeeds(seedData.records, table.TableName)
            addRecordsToTable(records, table.TableName)
          })
        })
      }
      else {
        createTable(table).then(res => {
          var records = getRecordsFromSeeds(seedData.records, table.TableName)
          addRecordsToTable(records, table.TableName)
        })
      }
    })
  })
}

/*
WARNING!
This will completely destroy your database and reseed it.
For each table provided in the `seeds.js` file:
This function checks whether it exists. If it does, it blows it away.
It then re-seeds each table with records with matching TableName key in
`seeds.js` file.
*/
run(seeds);

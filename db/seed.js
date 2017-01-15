/*
This module seeds the database with tables and seed values.
It draws the table data and record data from `./seedData.js`

NOTE: it is ONLY for use in development environments (commuter-dev or local)
*/
var dotenv = require('dotenv')
dotenv.load()
// NOTE: ensure you have aws-cli on your machine!
var AWS = require('aws-sdk')
AWS.config.region = process.env.AWS_REGION
var Dynamo = new AWS.DynamoDB();

/*
LOCAL ONLY! Uncomment the line below to set the endpoint to your local machine.
Make sure you have your own env var set here, or you'll be connecting to aws.
*/
// AWS.config.endpoint = process.env.AWS_ENDPOINT

// import crud functions
var crud = require('../models/database.js')

// import the seeds
var seeds = require('./seedData.js');

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

function checkTableStatus(tableData) {
  return new Promise(function(resolve, reject) {
    Dynamo.describeTable(tableData, function(err, data){
      if (err) {
        console.error(`There was no table by that name!`, JSON.stringify(err, null, 2));
        reject(err)
      }
      else {
        console.log(`Table status is`, JSON.stringify(data, null, 2));
        resolve(data)
      }
    })
  });
}

function dropAndCreateTable(tableData) {
  return new Promise(function(resolve, reject) {
    checkForTable(tableData).then(exists => {
      if (exists) {
        console.log("\nfound an existing table. Deleting...\n")
        destroyTable({TableName: tableData.TableName}).then(msg => {
          console.log(`\n\nwaiting three seconds for AWS to get their act together before we recreate the table...\n\n`);
          this.setTimeout(function(){
            createTable(tableData).then(res => {
              resolve(res);
            })
          }, 3000)
        })
      }
      else {
        console.log(`\ncreating a table...\n`);
        createTable(tableData).then(res => {
          resolve(res);
        })
      }
    })
  });
}

function dropAndCreateAllTables(tablesArray) {
  return tablesArray.map(tableObj => {
    return dropAndCreateTable(tableObj)
  })
}

function run(seedData) {
  var tableOperators = dropAndCreateAllTables(seedData.tables)
  Promise.all(tableOperators).then(results => {
    this.setTimeout(function(){
      return crud.batchUpdate(seedData.batchItems).then(msg => {
        console.log(msg)
      }).catch(err => {
        console.log(err)
      })
    }, 5000)
  })
}

/*
WARNING!
This will completely destroy your database and reseed it.
As a failsafe, I am including a 10 second timeout here to allow you to undo.
If you get the message: "You are connecting to AWS's servers" AND YOU DON'T INTEND
ON WIPING THE DEV SERVER then you can cancel the operation within 10 seconds.
*/
// run(seeds);
function failsafe(seedData) {
  if (AWS.config.endpoint != 'http://localhost:8000') {
    console.log(`You are destroying the actual development server data.\n
      You have 5 seconds to abort...`)
    setTimeout(function(){
      run(seedData)
    }, 3000);
  }
  else {
    run(seedData)
  }
}

failsafe(seeds)

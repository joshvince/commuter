/*
This module seeds the database with an initial table and blank line values
*/
var dotenv = require('dotenv')
dotenv.load()

// NOTE: ensure you have aws-cli on your machine!
var AWS = require('aws-sdk')
// Set the endpoint to your local machine.
AWS.config.update({region: process.env.AWS_REGION, endpoint: process.env.AWS_ENDPOINT});
// Initialise a new database locally
var Dynamo = new AWS.DynamoDB();
// import crud functions
var crud = require('./database.js')

/*
Seeds the database with a `line-status` table and (blank) Line records.
*/
function seed() {
  var tableParams = lineStatusTable();
  var recordsParams = createLineData();

  return new Promise((resolve, reject) => {
    Dynamo.createTable(tableParams, function(err, data){
      if (err) {
        console.error(`Unable to create Table. Error JSON: `, JSON.stringify(err, null, 2));
        reject(err)
      }
      else {
        console.log(`Created table. Table description JSON: `, JSON.stringify(data, null, 2));
        resolve(data)
      }
    })
  }).then(data => {
    recordsParams.forEach(obj => {
      return crud.write(obj, 'line-status').then(msg => {
        console.log("ADDED RECORD")
      }).catch(err => { console.log(err)})
    })
  })
}

function lineStatusTable() {
  return {
    TableName: "line-status",
    KeySchema: [
      { AttributeName: "id", KeyType: "HASH"}
    ],
    AttributeDefinitions: [
      {AttributeName: "id", AttributeType: "S"}
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 10
    }
  }
}

/*
This function creates an array of Tube Line objects ready to be written to the db.
The `lines` var is actually an array of objects which was created by the module
`SupportedLines.js` in `~/lib`. See documentation there for info on how this
is created.
*/
function createLineData() {
  // import supported line data (as an array of objects)
  var lines = require('../lib/SupportedLines.js')();
  return lines.map(obj => {
    return lineDbObject(obj)
  })
}

function lineDbObject(obj) {
  return {
    id: obj.id,
    info: {
      name: obj.name,
      scoreArray: '[]'
    }
  }
}

seed();

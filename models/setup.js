var dotenv = require('dotenv')
dotenv.load()
var AWS = require('aws-sdk')

// Set the endpoint to your local machine.
AWS.config.update({region: process.env.AWS_REGION, endpoint: process.env.AWS_ENDPOINT});

// Initialise a new database locally
var Dynamo = new AWS.DynamoDB();

var crud = require('./database.js')

// Create a line-status table. 
var tableParams = {
  TableName: "line-status",
  KeySchema: [
    { AttributeName: "name", KeyType: "HASH"} 
  ],
  AttributeDefinitions: [
    {AttributeName: "name", AttributeType: "S"}
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10
  }
};

var recordParams = {
  name: "northern",
  info: {
    scoreArray: '[]'
  }
}

function createTableAndRecord(params){
  return new Promise((resolve, reject) => {
    Dynamo.createTable(params, function(err, data){
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
    return crud.write(recordParams, 'line-status').then(msg => {
      console.log('DONE!');
    })
  })
}

createTableAndRecord(tableParams)


// // Create the table.
// Dynamo.createTable(params, function(err, data){
//   if (err) {
//     console.error(`Unable to create Table. Error JSON: `, JSON.stringify(err, null, 2));
//   }
//   else {
//     console.log(`Created table. Table description JSON: `, JSON.stringify(data, null, 2));
//     return data
//   }
// })



// // Create a blank record in the table
// crud.write(params, 'line-status');


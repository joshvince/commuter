var dotenv = require('dotenv')
dotenv.load()
const debug = require('debug')('database')
var AWS = require('aws-sdk');
AWS.config.region = process.env.AWS_REGION
/*
LOCAL ONLY: set the endpoint in an env var (probably localhost:8000) if you are
working on a local version of dynamodb.
Otherwise, please ensure you are connecting to AWS's `commuter-dev` environment
and not production.
*/
AWS.config.update({endpoint: process.env.AWS_ENDPOINT});

const Dynamo = new AWS.DynamoDB.DocumentClient();

function writeToDB(item, table){
  return new Promise((resolve, reject) => {
    if (table === undefined || table === null) {
      reject(`The table argument is ${table}.`);
    }
    else {
      Dynamo.put({
        TableName: table,
        Item: item
      }, (err, result) => {
        if (err) {
          debug(`there was an error. received this as an error: ` + err)
          reject(err);
        }
        else {
          console.log("created record");
          resolve(result);
        }
      })
    }
  });
}

function readFromDB(item, table){
  return new Promise((resolve, reject) => {
    if (table == undefined || table === null) {
      reject(`The table argument is ${table}`);
    }
    else {
      Dynamo.get({
        TableName: table,
        Key: item
      }, (err, data) => {
        if (err) {
          debug(`got an error` + err)
          reject(err);
        }
        else {
          debug(`read the following data from the db: ` + data)
          resolve(data);
        }
      })
    }
  })
}

function updateInDB(item, updateExpression, expressionValues, table){
  return new Promise((resolve, reject) => {
    Dynamo.update({
      TableName: table,
      Key: item,
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionValues,
      ReturnValues:"UPDATED_NEW"
    }, (err, data) => {
      if (err) {
        debug(`Got an error: ` + err)
        reject(err);
      }
      else {
        debug(`Updated successfully and received this data back: ` + JSON.stringify(data))
        resolve(data);
      }
    })
  })
}

/*
This one has a unique API: it must be given a JSON where each key is a TableName.
Each associated value can be an array of objects that are either:
PutRequest: {Item: {object_to_be_written}} which will then add the given object
to the table.
DeleteRequest: {Key: {object_containing_key}} which will find the given object
by its given key and delete it from the table.

It does this for each item in each table. It is exposed as `batchUpdate`
*/
function batchUpdate(itemJson) {
  return new Promise((resolve, reject) => {
    Dynamo.batchWrite(itemJson, (err, data) => {
      if (err) {
        debug(`Received an error` + err)
        reject(err);
      }
      else {
        debug(`successfully Batch Wrote and received this data back: ` + JSON.stringify(data))
        resolve(data);
      }
    })
  });
}

module.exports = {
  write: writeToDB,
  read: readFromDB,
  update: updateInDB,
  batchUpdate: batchUpdate
}

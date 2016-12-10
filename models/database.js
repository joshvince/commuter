var dotenv = require('dotenv')
dotenv.load()
var AWS = require('aws-sdk');
AWS.config.update({
  region: process.env.AWS_REGION, 
  endpoint: process.env.AWS_ENDPOINT
})

const debug = require('debug')('database')
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
          debug(`the record created was: \n` + JSON.stringify(result))
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

module.exports = {
  write: writeToDB,
  read: readFromDB,
  update: updateInDB
}
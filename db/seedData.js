// SEEDS FOR THE DB.

const lineStatusTableName = process.env.LINE_STATUS_TABLE
const feedbackTableName = process.env.FEEDBACK_TABLE

const tables = [
  // CREATE LINE-STATUS TABLE
  {
    TableName: lineStatusTableName,
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
  },
  // CREATE FEEDBACK TABLE
  {
    TableName: feedbackTableName,
    KeySchema: [
      { AttributeName: "timestamp", KeyType: "HASH"}
    ],
    AttributeDefinitions: [
      {AttributeName: "timestamp", AttributeType: "S"}
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 10
    }
  }
]

// GENERATE OBJECTS FOR EACH OF THE LINES SUPPORTED:
function generateLineData(lineObj) {
    return {
      id: lineObj.id,
      info: {
        name: lineObj.name,
        scoreArray: "[10,10,10,10,10,10,10,10,10,10,10,10]"
      }
    }
}
var lineObjects = require('../lib/SupportedLines.js')().map(obj =>{
  return generateLineData(obj)
});

// GENERATE A TEST FEEDBACK OBJECT
const feedbackObjects = [
  {
    lineId: "northern",
    scoreArray: [10,10,10,10,10,10,10,10,10,10,10,10],
    timestamp: "2017-01-12T13:45:08.577Z",
    display: {
      "current": "Good Service",
      "historic":"No problems"
    },
    feedback: true
  }
]

// ADD EACH OF THESE UNDER THE RELEVANT TABLE NAME TO THE CORRECT FORMAT ACCEPTED
// BY DYNAMODB'S BATCHWRITE FUNCTION.
// SPEC HERE: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#batchWrite-property

function generateBatchWriteItemJSON(lineStatusObjs, feedbackObjs) {
  return {
    "RequestItems": {
      [lineStatusTableName]: generateOneBatchArray(lineStatusObjs),
      [feedbackTableName]: generateOneBatchArray(feedbackObjs)
    }
  }
}

function generateOneBatchArray(data) {
  return data.map(obj => {
    return {
      "PutRequest": {
        "Item": obj
      }
    }
  })
}

var batchItems = generateBatchWriteItemJSON(lineObjects, feedbackObjects)

module.exports = {
  tables: tables,
  batchItems: batchItems
}

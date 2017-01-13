// SEEDS FOR THE DB.

const tables = [
  // CREATE LINE-STATUS TABLE
  {
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
  },
  // CREATE FEEDBACK TABLE
  {
    TableName: "feedback",
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

const feedbackSeeds = {
  TableName: 'feedback',
  records: [
    {
      lineId: "northern",
      scoreArray: [10,10,10,10,10,10,10,10,10,10,10,10],
      timestamp: "2017-01-12T13:45:08.577Z",
      display: {"current":"Good Service","historic":"No problems"},
      feedback: true
    }
  ]
}

function generateLineData(lineObj) {
    return {
      id: lineObj.id,
      info: {
        name: lineObj.name,
        scoreArray: "[10,10,10,10,10,10,10,10,10,10,10,10]"
      }
    }
}

var lines = require('../lib/SupportedLines.js')();
var lineObjects = lines.map(obj => { return generateLineData(obj) })

const lineStatusSeeds = {
  TableName: 'line-status',
  records: lineObjects
}

module.exports = {
  tables: tables,
  records: [lineStatusSeeds, feedbackSeeds],
  lineStatusSeeds: lineStatusSeeds,
  feedbackSeeds: feedbackSeeds
}

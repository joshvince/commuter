module.exports = function(){
  var dotenv = require('dotenv')
  dotenv.load()
  var express = require('express')
  var morgan = require('morgan')
  const debug = require('debug')('tflServer')
  var app = express()
  var port = process.env.TFL_PORT || 5001

  app.use(morgan('dev'))

  app.get('/Line/:id/Status', (req, res, next) => {
    res.send(sendDelay())
    // res.send(sendGoodService())
  })

  app.use((err, req, res, next) => {
    console.log("Special Error Log: " + err)
    res.status(500).send("Oops! Something went wrong")
  })

  app.listen(port, () => {
    console.log(`Fake TFL is listening on port ${port}`)
  })

  function sendDelay(){
    return '[{"$type":"Tfl.Api.Presentation.Entities.Line, Tfl.Api.Presentation.Entities","id":"northern","name":"Northern","modeName":"tube","disruptions":[],"created":"2016-11-16T14:26:06.87Z","modified":"2016-11-16T14:26:06.87Z","lineStatuses":[{"$type":"Tfl.Api.Presentation.Entities.LineStatus, Tfl.Api.Presentation.Entities","id":0,"statusSeverity":6,"statusSeverityDescription":"Severe Delays","created":"0001-01-01T00:00:00","validityPeriods":[]}],"routeSections":[],"serviceTypes":[{"$type":"Tfl.Api.Presentation.Entities.LineServiceTypeInfo, Tfl.Api.Presentation.Entities","name":"Regular","uri":"/Line/Route?ids=Northern&serviceTypes=Regular"},{"$type":"Tfl.Api.Presentation.Entities.LineServiceTypeInfo, Tfl.Api.Presentation.Entities","name":"Night","uri":"/Line/Route?ids=Northern&serviceTypes=Night"}]}]'
  }

  function sendGoodService(){
    return '[{"$type":"Tfl.Api.Presentation.Entities.Line, Tfl.Api.Presentation.Entities","id":"northern","name":"Northern","modeName":"tube","disruptions":[],"created":"2016-11-16T14:26:06.87Z","modified":"2016-11-16T14:26:06.87Z","lineStatuses":[{"$type":"Tfl.Api.Presentation.Entities.LineStatus, Tfl.Api.Presentation.Entities","id":0,"statusSeverity":10,"statusSeverityDescription":"Good Service","created":"0001-01-01T00:00:00","validityPeriods":[]}],"routeSections":[],"serviceTypes":[{"$type":"Tfl.Api.Presentation.Entities.LineServiceTypeInfo, Tfl.Api.Presentation.Entities","name":"Regular","uri":"/Line/Route?ids=Northern&serviceTypes=Regular"},{"$type":"Tfl.Api.Presentation.Entities.LineServiceTypeInfo, Tfl.Api.Presentation.Entities","name":"Night","uri":"/Line/Route?ids=Northern&serviceTypes=Night"}]}]'
  }
}

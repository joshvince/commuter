module.exports = function(){
  var dotenv = require('dotenv')
  dotenv.load()
  var express = require('express')
  var morgan = require('morgan')
  const debug = require('debug')('server')
  var app = express()

  app.use(morgan('dev'))

  app.get('/Line/northern/Disruption', (req, res, next) => {
    res.send(sendGoodService())
  })

  app.get('/Line/:id/Disruption', (req, res, next) => {
    res.send(sendDelay())
  })

  app.use((err, req, res, next) => {
    console.log("Special Error Log: " + err)
    res.status(500).send("Oops! Something went wrong")
  })

  app.listen(5000, () => {
    console.log("Fake TFL is listening on port 5000")
  })

  function sendDelay(){
    return {"$type":"Tfl.Api.Presentation.Entities.Disruption, Tfl.Api.Presentation.Entities","category":"RealTime","type":"routeInfo","categoryDescription":"RealTime","description":"Bakerloo Line: Minor delays between Queens Park and Harrow & Wealdstone due to an earlier signal failure at Queens Park .GOOD SERVICE on the rest of the line. ","affectedRoutes":[],"affectedStops":[],"closureText":"minorDelays"}
  }

  function sendGoodService(){
    return []
  }
}
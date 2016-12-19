var dotenv = require('dotenv')
dotenv.load()
var express = require('express')
var morgan = require('morgan')
const debug = require('debug')('server')
var app = express()

// LOG THE REQUESTS IN DEV MODE FOR NOW
app.use(morgan('dev'))

// START THE FAKETFLSERVER
var fakeTflServer = require('./fakeTflServer.js')
fakeTflServer();

var Tfl = require('./lib/Tfl.js')
var LineStatus = require('./lib/LineStatus.js');
var SupportedLines = require('./lib/SupportedLines.js')();
var database = require('./models/database.js')

Tfl.poll("northern")

// RENDER A BASIC HOMEPAGE AT ROOT 
//TODO: remove this as no one should be hitting this endpoint.
app.get('/', (req, res) => {
  var title = `<h1> Tube Status </h1><br>`

  function links(lines){
    return lines.map((el) =>{
      return `<a href="/lines/${el.lowercase}">${el.name} Line</a><br>`
    })
  }
  
  res.send(title + links(SupportedLines))
})

/*
API:
The /lines/:id endpoint returns an object containing two fields:
object.current is the latest status, which is fetched from the TFL API when the request is made
object.lastHouse is an aggregated description of the last hour's service statuses.
*/
app.get('/lines/:id', (req, res, next) => {
  LineStatus.getStatus(req.params.id).then(data => {
    res.send(data)
  })
})


// ERROR HANDLER
app.use((err, req, res, next) => {
  console.log("Special Error Log: " + err)
  res.status(500).send("Oops! Something went wrong")
})

app.listen(3001, () => {
  console.log("Listening on port 3001")
})
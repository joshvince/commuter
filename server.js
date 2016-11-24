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

var LineStatus = require('./lib/LineStatus.js');
var SupportedLines = require('./lib/SupportedLines.js')();
var database = require('./models/database.js')

LineStatus.run("northern")

// RENDER A BASIC HOMEPAGE AT ROOT 
//TODO: extract out the rendering stuff to a separate module!
app.get('/', (req, res) => {
  var title = `<h1> Tube Status </h1><br>`

  function links(lines){
    return lines.map((el) =>{
      return `<a href="/lines/${el.lowercase}">${el.name} Line</a><br>`
    })
  }
  
  res.send(title + links(SupportedLines))
})

// TODO: THIS ISN'T WORKING!!!

app.get('/lines/:id', (req, res, next) => {
  LineStatus.sendScoreToClient(req.params.id, 'line-status').then(data => {
    debug("data is: " + data)
    res.send(data.toString())
  })
})

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.log("Special Error Log: " + err)
  res.status(500).send("Oops! Something went wrong")
})

app.listen(3000, () => {
  console.log("Listening on port 3000")
})
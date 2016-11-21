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

var TubeStatus = require('./lib/TubeStatus.js').TubeStatus;
var SupportedLines = require('./lib/SupportedLines.js')();
var line = require('./models/line.js')


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

app.get('/lines/:id', (req, res, next) => {
  TubeStatus(req.params.id).then(data => {
    res.send(data)
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
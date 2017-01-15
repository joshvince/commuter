var dotenv = require('dotenv');
dotenv.load();
var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var morgan = require('morgan');
const debug = require('debug')('server');
var app = express();
var port = process.env.PORT || 3001

// TO LOG THE REQUESTS IN DEV MODE
// uncomment the following line
app.use(morgan('dev'))

// TO START THE FAKETFLSERVER (For dev purposes)
// uncomment these next two lines!
// var fakeTflServer = require('./fakeTflServer.js');
// fakeTflServer();

var Tfl = require('./lib/Tfl.js')
var LineStatus = require('./lib/LineStatus.js');
var SupportedLines = require('./lib/SupportedLines.js')();
var database = require('./models/database.js');
var Feedback = require('./models/feedback.js');

// POLL TFL FOR THE STATUS OF EACH OF THE LINES
var lineIds = SupportedLines.map(el => { return el.id })






// Tfl.poll(lineIds)








// RENDER A BASIC HOMEPAGE AT ROOT
//TODO: remove this as no one should be hitting this endpoint.
app.get('/', (req, res) => {
  var title = `<h1> Tube Status </h1><br>`
  function links(lines){
    return lines.map((el) =>{
      return `<br><a href="/lines/${el.id}">${el.name} Line</a>`
    })
  }
  res.send(title + links(SupportedLines))
})

/*
API:
The /lines/:id endpoint returns an object containing three fields:
object.current is the latest status, which is fetched from the TFL API when the request is made
object.lastHour is an aggregated description of the last hour's service statuses.
object.raw is an array of the latest code and the 12 previous codes from the DB.
*/
app.get('/lines/:id', (req, res) => {
  LineStatus.getStatus(req.params.id).then(data => {
    res.send(data)
  })
})

/*
API:
The /lines endpoint returns an array of Line objects.
Each supported line (currently in the database) has an object with two attributes:
`name` and `id`
*/
app.get('/lines', (req, res) => {
  res.send(SupportedLines)
})

/*
API:
The /lines/feedback endpoint receives POST requests and updates the feedback table
with relevant feedback from the webapp.
*/
app.post('/lines/feedback', jsonParser, (req, res) => {
  Feedback.writeToDb(req.body)
  res.status(200).send("Received")
})

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.log("Special Error Log: " + err)
  res.status(500).send("Oops! Something went wrong")
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

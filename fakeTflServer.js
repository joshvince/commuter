var dotenv = require('dotenv')
dotenv.load()
var express = require('express')
var morgan = require('morgan')
const debug = require('debug')('server')
var app = express()

app.use(morgan('dev'))

app.get('/Line/:id/Disruption', (req, res, next) => {
  res.send({"status": "GoodService", "line": `${req.params.id}`})
})

app.use((err, req, res, next) => {
  console.log("Special Error Log: " + err)
  res.status(500).send("Oops! Something went wrong")
})

app.listen(5000, () => {
  console.log("Fake TFL is listening on port 5000")
})
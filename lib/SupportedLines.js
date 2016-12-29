/*
SUPPORTED LINES
This module gets exports a function that creates an array of Tube Line objects.
Each object has a name and an ID attribute.
These objects are then used in the server to create routes, and to poll the
tfl server etc.

Use this module by calling it as a function from another module
*/

var request = require('request')
var fs = require('fs')

function compose() {
  var funcs = arguments;
  return function() {
    var args = arguments;
    for (var i = funcs.length; i --> 0;) {
      args = [funcs[i].apply(this, args)];
    }
    return args[0];
  };
}

function createObjects(path) {
  var f = compose(generateObjects, parse, loadJson)
  return f(path)
}

function loadJson(path) {
  return fs.readFileSync(path, 'utf8', (err, data) => {
    return data
  })
}

function parse(data) {
  return JSON.parse(data)
}

function generateObjects(array) {
  return array.map(obj => {
    return generateOneObject(obj)
  })
}

function generateOneObject(obj){
	return {
		"name": obj.name,
		"id": obj.id
	}
}

module.exports = function(){
  return createObjects('./lib/Lines.json')
}

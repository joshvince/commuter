module.exports = function(){
	// ADD A CAPITALISED LINE NAME HERE TO ADD IT TO THE APP
	var lineList =  ["Northern"]
	return lineList.map(el => {return generateObject(el)})
}

function generateObject(name){
	var lowcase = name.toLowerCase()
	return {
		"name": name,
		"lowercase": lowcase,
		"id": 1,
		"tfl_line_id": "northern"
	}
}
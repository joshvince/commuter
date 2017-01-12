# Commuter

This app calls the TFL API at regular intervals to get the status of tube lines.
Currently the only functionality in this app is an aggregate "score" of the last hour's status updates. Eventually, this service will also look to assign scores to individual trains. See the API for more details.

## Setting up the app locally

### DB Set Up
Commuter uses Amazon DynamoDB for the database. To run this, you need to already have AWS CLI set up.

Amazon has some [very good docs](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html)
on getting DynamoDB set up on your local machine. Again, remember you need AWS CLI set up to do this.  

*Recommended* Install the `DynamoDBLocal.jar` to your root folder to allow you to use the convenient script.        
Once you have the `DynamoDBLocal.jar` installed on your computer, you can run `npm run start-dynamo` if you have installed the `.jar` file in your root folder. Otherwise, navigate to the directory you installed the `.jar` file in and run:  

`java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb`  

You now have a new instance of DynamoDB running on your computer. See the amazon DynamoDB docs for information on how to access this db directly from the command line.

### Project Set Up
First, clone this directory, `cd` into it and run: `npm i`

To initialise the DB and seed initial data, run `npm run setup-db`

If you need to wipe the DB at a later point, you can run `npm run reset-db`

### Starting the server
Run `npm run debug-start` to start the server with all debugging on. This will help you to work out when the DB is being updated.  

Run `npm run start` to start the server "normally". All it does is start `server.js` and won't log anything to do with the DB.  


### Using a fake TFL server
By default, this app calls the TFL API. However, this may be impractical for a number of reasons, like if you want to hammer the endpoints more than TFL allows, or if you're not currently in possession of TFL API credentials.  

To counter this, `server.js` automatically starts a fake TFL server on port `5000` that simulates the actual TFL one locally. However, you will need to use your environment variables to actually use this over the real one.    

In your `.env` file, make sure you comment/alter/remove the line `TFL_SERVER=https://api.tfl.gov.uk` and keep the line `TFL_SERVER=http://localhost:5000`.  

If you have this local variable, you'll be calling your fake TFL server rather than the real one. You can amend the responses based on your needs by changing the `./fakeTflServer.js` file in the root directory of this project.

## API

GET **`/lines`**  

This endpoint will return a JSON array of available line objects.  
Each object is an `id` and a `name`. Only lines that are contained in this response are being tracked by Commuter, and you can hit the relevant `/lines/:id` endpoint to get the score.  

*Example response:*  
`[{"name": "Northern", "id": "northern"}, {"name": "Victoria", "id": "victoria"}]`  

GET **`/lines/:id`**

This endpoint returns a JSON object containing a `current` status for the given line as well as a `lastHour` aggregate "score". This aggregate score is a sentence that outlines the level of delays/closures on the line in the last 60 minutes.  

*Example response:*  
`{"current": "Minor Delays", "lastHour": "Lots of Problems"}`

POST **`lines/feedback`**  

This endpoint allows a client to post feedback data to help improve commuter. The POST data should
be JSON in the following format:
```
{
  line: {
    id: "string"
  },
  feedback: {
    timestamp: "string",
    feedback: boolean
  },
  display: {
    currentStatus: "string",
    historicStatus: "string"
  },
  raw: [array]
}
```
Currently, commuter returns a terse response, just a 200 status code and a tiny string. Sorry about that.

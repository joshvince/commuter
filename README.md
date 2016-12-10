# Commuter

This app calls the TFL API at regular intervals to get the status of tube lines (currently nothern line only).  
When a client hits the `/lines/:id` endpoint, an aggregate "score" will be returned.  

This score is basically an aggregate score of the last hour's status reports from TFL. The best score it can be is 0 - which means there were no delays at all in the last hour. Check out `/lib/LineStatus.js` for details on what's going on here.  

There's a lot more to come from this app.  

## DB Set Up
Commuter uses Amazon DynamoDB for the database. To run this, you need to already have AWS CLI set up.

Amazon has some [very good docs](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html) 
on getting DynamoDB set up on your local machine. Again, remember you need AWS CLI set up to do this.  

*Recommended* Install the `DynamoDBLocal.jar` to your root folder to allow you to use the `npm run start-dynamo` script.      
Once you have the `DynamoDBLocal.jar` installed on your computer, navigate to that directory and run:     
`java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb`  

You now have a new instance of DynamoDB running on your computer.


## Project Set Up
First, clone this directory, `cd` into it and run: `npm i`

To initialise the DB, run `npm run setup-db`

If you need to wipe the DB at a later point, you can run `npm run reset-db`

## Starting the server
Run `npm run debug-start` to start the server with all debugging on. This will help you to work out when the DB is being updated.  

Run `npm run start` to start the server "normally". All it does is start `server.js` and won't log anything to do with the DB.  


## Using a fake TFL server
By default, this app calls the TFL API. However, this may be impractical for a number of reasons, like if you want to hammer the endpoints more than TFL allows, or if you're not currently in possession of TFL API credentials.  

To counter this, `server.js` automatically starts a fake TFL server on port `5000` that similuates the actual TFL one on your computer. However, you will need to use your environment variables to actually use this over the real one.    

In your `.env` file, make sure you comment/alter/remove the line `TFL_SERVER=https://api.tfl.gov.uk` and keep the line `TFL_SERVER=http://localhost:5000`.  

If you have this local variable, you'll be calling your fake TFL server rather than the real one. You can amend the responses based on your needs by changing the `./fakeTflServer.js` file in the root directory of this project.





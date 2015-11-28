// if (process.argv.length !== 3) printUsageAndExit();

var Queue = require('./queue.js');
// var queueName = process.argv[2];

var redis = require('redis');
var host = process.env.REDIS_PORT_6379_TCP_ADDR || 'localhost';
var client = redis.createClient(6379, host);

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true  }));

app.get('/', handler);
app.post('/:queueName', postHandler);
var server = app.listen(8000, serverMessage);



/*             ¸.·´¯`·.´¯`·.¸¸.·´¯`·.¸><(((º>                 */


function printUsageAndExit () {
  console.log('Error: pass in queue name');
  console.log('$ node task-runner.js <queue-name>');
  process.exit(1);
}

function handler (req, res) {
  // var jobName = req.params.job;
  // var numberOfTasks = req.params.num;
  // queue.createTasks(jobName, numberOfTasks);
  res.send('please see redis-cli for details');
}

function postHandler (req, res) {
  var queueName = req.params.queueName;
  var queue = new Queue(queueName, client);
  var jobName = req.body.job;
  var numberOfTasks = req.body.num;

  queue.createTasks(jobName, numberOfTasks);
  res.send('post received for', numberOfTasks, jobName, 'in job queue', queueName, '.\n');
}

function serverMessage () {
  console.log('listening on port 8000');
}

if (process.argv.length !== 5) printUsageAndExit();

var Queue = require('../classes/queue.js');
var queueName = process.argv[2];
var jobName = process.argv[3];
var numberOfTasks = process.argv[4];

var redis = require('redis');
var host = process.env.REDIS_PORT_6379_TCP_ADDR || 'localhost';
var client = redis.createClient(6379, host);

var express = require('express');
var app = express();

app.get('/', handler);
var server = app.listen(8000, serverMessage);



/*             ¸.·´¯`·.´¯`·.¸¸.·´¯`·.¸><(((º>                 */


function printUsageAndExit () {
  console.log('Usage: node task-runner.js <queue-name> <job-name> <number-of-tasks>');
  process.exit(1);
}

function handler (req, res) {
  var queue = new Queue(queueName, client);
  queue.createTasks(jobName, numberOfTasks);
  res.send('<h3>' + numberOfTasks + ' tasks submitted</h3><div><em>Job Name:</em><ul><li>' + jobName + '</li></ul></div>');
}

function serverMessage () {
  console.log('listening on port 8000');
}

if (process.argv.length > 3) printUsageAndExit();
var queueName = process.argv[2] || 'jobs';

var redis = require('redis');
var host = process.env.REDIS_PORT_6379_TCP_ADDR || 'localhost';
var client = redis.createClient(6379, host);

var Queue = require('./queue.js');
var queue = new Queue(queueName, client);

queue.runTasks();


/* ( •_• )O*¯`·.¸.·´¯`°Q(•_• ) */


function printUsageAndExit () {
  console.log('Usage: node task-runner.js <queue-name>');
  process.exit(1);
}

var os = require('os');

function Queue (key, client) {
  this.key = key;
  this.client = client;
  // 0 === no timeout. We're using `brpop` (blocking) and don't want this worker to stop during extended waits.
  this.timeout = 0;
}

Queue.prototype.push = function (data) {
  this.client.lpush(this.key, data);
};

Queue.prototype.createTasks = function (jobName, numberOfTasks) {
  
  for (var i = 0; i < Number(numberOfTasks); i++) {
    // this.push(jobName + ' - ' + i);
    var task = {
      name: jobName,
      data: i
    };
    this.push(JSON.stringify(task));
  }

};

module.exports = Queue;


var os = require('os');
var ticker = 1;

function Queue (key, client) {
  this.key = key;
  this.client = client;
  // 0 === no timeout. We're using `brpop` (blocking) and don't want this worker to stop during extended waits.
  this.timeout = 0;
}


Queue.prototype.printInfo = function () {
  this.size(function (err, size) {
    console.log('Key: ' + this.key);
    console.log('Client: ' + this.client);
    console.log('Size: ' + size);
  });
};

Queue.prototype.push = function (data) {
  this.client.lpush(this.key, data);
};

Queue.prototype.pop = function (callback) {
  this.client.brpop(this.key, this.timeout, callback);
};

Queue.prototype.size = function (callback) {
  this.client.llen(this.key, callback);
};

Queue.prototype.runTasks = function () {

  var self = this;

  self.pop(function (err, replies) {
    if (err) throw new Error(err);

    var host = os.hostname();
    var time = Date.now();
    var rawTask = replies[1];
    var task = JSON.parse(rawTask);
    var taskName = task.name;
    var taskData = task.data;

    var doneKey = self.key + ':' + taskName + ':done';
    var doneHostKey = self.key + ':' + taskName + ':' + host;
    var resultsKey = self.key + ':' + taskName + ':results';

    self.client.sadd(doneKey, rawTask);
    self.client.sadd(doneHostKey, rawTask);

    var taskResult = doubler(taskData);
    self.client.sadd(resultsKey, taskResult, function (err, data) {
      self.runTasks();
    });

  });

}

function doubler (task) {
  var result = task * 2;
  console.log('completed task', task, 'with result', result);
  return result;
}

module.exports = Queue;

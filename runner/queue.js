var os = require('os');

function Queue (name, client) {
  this.name = name;
  this.key = 'queues:' + name;
  this.client = client;
  this.timeout = 0;
}


Queue.prototype.printStatus = function () {
  console.log('Name: ' + this.name + '\nKey: ' + this.key + '\nClient: ' + this.client);
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

  this.pop(function (err, replies) {
    if (err) throw new Error(err);

    var host = os.hostname();
    var task = replies[1];
    var key = 'jobs:' + host;

    self.client.lpush(key, Date.now() + ':' + task);
    self.runTasks();
  });

}


Queue.prototype.createTasks = function (jobName, numberOfTasks) {
  
  for (var i = 0; i < numberOfTasks; i++) {
    this.push(jobName + ':' + i);
  }
  this.client.quit();

};

module.exports = Queue;


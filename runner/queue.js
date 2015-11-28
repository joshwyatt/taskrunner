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
    var task = replies[1];

    var doneKey = self.key + ':done';
    var doneHostKey = self.key + ':' + host;

    self.client.sadd(doneKey, task);
    self.client.sadd(doneHostKey, task);

    console.log('[OK]', task);
    self.runTasks();
  });

}

module.exports = Queue;

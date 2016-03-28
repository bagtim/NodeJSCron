var cronJob = require('cron').CronJob;
var request = require('request');


var cronTab = function() {
  this.jobs = {};
};

 
cronTab.prototype.add = function(job) {
  if (this.jobs[job.id]) return false;
  var cron = new cronJob(job.expression, function() {
      console.log(job.run_cmd);  
      request.get(job.run_cmd);  
  }, false, null);
  if (job.is_active == 1){
    cron.start();
    console.log("Job START");
  }
    
  this.jobs[job.id] = cron;
  return true;
}
/*
cronTab.prototype.stop = function() {
  player.stop();
}
*/
cronTab.prototype.remove = function(job) {
  if (!this.jobs[job.id]) return false;
  this.jobs[job.id].stop();
  delete this.jobs[job.id];
  return true;
}

cronTab.prototype.update = function(job) {
  console.log("update!!!");
  return this.remove(job) && this.add(job);
}

/*
cronTab.prototype.togglePause = function(job) {
  if (!this.jobs[job.id]) return false;
  if (this.jobs[job.id].running) {
    this.jobs[job.id].stop();
  } else {
    this.jobs[job.id].start();
  }
  return true;
}
*/

cronTab.prototype.StopJob = function(job) {
  if (!this.jobs[job.id]) return false;
  if (this.jobs[job.id].running) {
    this.jobs[job.id].stop();
  }
  console.log("stop Job");
  return true;
  
}

cronTab.prototype.StartJob = function(job) {
  if (!this.jobs[job.id]) return false;
  if (!this.jobs[job.id].running) {
    this.jobs[job.id].start();
  }
  console.log("start Job");
  return true;
    
}

/*
cronTab.prototype.removeAll = function() {
  var nbJobs = 0;
  for (id in this.jobs) {
    if (!this.remove(this.jobs[id])) return false;
    nbJobs++;
  }
  return nbJobs;
}
*/
module.exports = new cronTab();
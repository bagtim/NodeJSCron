// BASE SETUP
// =============================================================================

var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');
var CronTab = require('./app/lib/cronTab');
var mysql = require('mysql');
var Job = require('./app/models/job');

app.use(morgan('dev')); 


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 8053; 



var connection = mysql.createConnection({
host : 'localhost',
user : 'root',
database :'homedb',
password : 'tima'
});

connection.connect();


var router = express.Router();

router.use(function(req, res, next) {
	
	res.setHeader('Access-Control-Allow-Origin', '*');    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Credentials', true);
	console.log('Something is happening.');
	next();
});


router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });
});

// Инициализация из базы jobs	
connection.query('SELECT * from cronjob_view', function(err, rows, fields) {
	if (err) throw err;
	rows.forEach(function (job) {
		if (err) return callback(err);
  		if (job) {
  			CronTab.add(job);
   			console.log('Initialized job %s (%s) Active: %s', job.id,job.expression, job.is_active);
   			
   		}
	});
});
/*
// ALARM API
// Остановить будильник
router.get('/alarm/stop', function(req, res) {
	res.json({ message: 'Stop!' });
	console.log('stop');
	CronTab.stop();	
});

// Получить id будильника для дальнейшей работы с ним
function getAlarmId(callback){
	connection.query('SELECT id from cronjobs where type=1', function(err, rows, result) {
		rows.forEach(function (alarm) {
	   		callback(alarm.id);
		});
	});
}
// Включить будильник
router.get('/alarm/on', function (req, res){
	console.log("on alarm");
	getAlarmId(function(alarmId){
		var job = new Job();
	 	job.id = alarmId;
		connection.query('UPDATE cronjobs SET is_active=1 where id=\''+job.id+'\'', function(err, results) 
		{
			if (err) throw err;
			if (results)
			{
				res.type('application/json');
				res.send([{"updated alarm":1}]);	
				CronTab.StartJob(job);
			}
		});
	});
});
// Выключить будильник
router.get('/alarm/off', function (req, res){
	console.log("off alarm");
	getAlarmId(function(alarmId){
		var job = new Job();
	 	job.id = alarmId;

		connection.query('UPDATE cronjobs SET is_active=0 where id=\''+job.id+'\'', function(err, results) 
		{
			if (err) throw err;
			if (results)
			{
				res.type('application/json');
				res.send([{"updated alarm":1}]);	
				CronTab.StopJob(job);
			}
		});
	});
});
// Получить инфу по будильнику
router.get('/alarm', function(req, res){
	getAlarmId(function(alarmId){
		connection.query('SELECT * from cronjobs where id=\''+alarmId+'\'', function(err, rows, fields) {
			if (err) throw err;
			res.type('application/json');
			res.send(rows);
		});		
	});

});
// Обновить данные будильника
router.put('/alarm/update', function(req, res){
	getAlarmId(function(alarmId){
		var job = new Job();		
		job.name = req.body.name;
		job.id = alarmId;
		job.type = 1;
		job.expression = req.body.expression;
		job.value = "123.mp3";
		connection.query('UPDATE cronjobs SET name=\''+job.name+'\', expression=\''+job.expression+'\' where id=\''+job.id+'\'', function(err, results) {
			if (err) throw err;
			if (results){
				res.type('application/json');
				res.send([{"updated alarm":1}]);	
				CronTab.update(job);			
			}
		});  
	});
});

*/

// ----------------------------------------------------

router.route('/jobs')
	
	.post(function(req, res) {
		
		var job = new Job();		
		// job.name = req.body.name;
		 job.expression = req.body.expression;  
		// job.value = req.body.value;
		// job.type = req.body.type;
		
		connection.query('INSERT INTO bg_cronjobs (name, expression, type, value) VALUES(\''+ job.name +'\',\''+job.expression+'\',\''+job.type+'\',\''+job.value+'\')', 
			function(err,result) {
			if (err) throw err;
			if (result) {
				job.id = result.insertId;
				res.type('application/json');
				res.send([{"added":1}]);
				if (CronTab.add(job)){
					//res.redirect('/jobs/' + job._id);
				}				
			}
		});		
	});
/*
	.get(function(req, res) {
		connection.query('SELECT * from cronjobs', function(err, rows, fields) {
			if (err) throw err;
			//res.type('application/json');
			//res.send(rows);
			res.json(rows);
		});
	});
*/


// ----------------------------------------------------
// get http://localhost:8080/jobs/35/1 - on alarm, 0 - off alarm
/*
router.route('/jobs/:id/:is_active').get(function(req, res){
	var job = new Job();
	 job.id = req.params.id;
	 job.is_active = req.params.is_active;
connection.query('UPDATE cronjobs SET is_active=\''+job.is_active+'\' where id=\''+job.id+'\'', function(err, results) {
	if (err) throw err;
	if (results){
		res.type('application/json');
		res.send([{"updated alarm":1}]);	
		if (job.is_active == 0) {
			CronTab.StopJob(job);
		} else {
			CronTab.StartJob(job);
		}	
	}
});
});
*/

//router.route('/jobs/:job_id')

	/*
	.get(function(req, res) {
		connection.query('SELECT * from cronjobs where id=\''+req.params.job_id+'\'', function(err, rows, fields) {
			if (err) throw err;
			res.type('application/json');
			res.send(rows);
		});
	})

	
	.put(function(req, res) {
		var job = new Job();
		job.id = req.params.job_id;
		job.name = req.body.name;
		job.expression = req.body.expression;
		job.value = req.body.value;	
		connection.query('UPDATE cronjobs SET name=\''+job.name+'\', expression=\''+job.expression+'\', value=\''+job.value+'\' where id=\''+job.id+'\'', function(err, results) {
			if (err) throw err;
			if (results){
				res.type('application/json');
				res.send([{"updated":1}]);	
				CronTab.update(job);			
			}
		});   	
	})
	
	.delete(function(req, res, next) {
		var job = new Job();
		job.id = req.params.job_id;
		connection.query('DELETE from bg_cronjobs where id = '+job.id, function(err,result) {
			if (err) throw err;
			if(result) {
				res.type('application/json');
				res.send([{"deleted":1}]);
				CronTab.remove(job);
			}
		});
	});
*/
// REGISTER OUR ROUTES -------------------------------
app.use('/', router);

// START THE SERVER
// =============================================================================
app.listen(port);
//console.log("alarm: " +xz);
console.log('Magic happens on port ' + port);

var Schema   = require('node-schema-object');

var Job = new Schema({
	run_cmd :   String,
 	expression : String,
    is_active:   Number
});

module.exports = Job;
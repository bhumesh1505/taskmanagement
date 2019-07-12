var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var departentSchema = new Schema({
    departmentname: {type: String, lowercase: true, required: true},
    groups:[{type:Object}]
});

module.exports = mongoose.model('Department',departentSchema);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var subgroupSchema = new Schema({
    subgroupname: {type: String, lowercase: true, required: true},
    activities:[{type:Object}]
});

module.exports = mongoose.model('Subgroup',subgroupSchema);
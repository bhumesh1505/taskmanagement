var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var groupSchema = new Schema({
    groupname: {type: String, lowercase: true, required: true},
    subgroups: [{type:Object}]
});

module.exports = mongoose.model('Group',groupSchema);
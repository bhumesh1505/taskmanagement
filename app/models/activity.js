var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ActivitySchema = new Schema({
    activityname: { type: String, lowercase: true}
});
module.exports = mongoose.model('Activity',ActivitySchema);
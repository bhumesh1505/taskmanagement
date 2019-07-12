var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
    name: { type: String, lowercase: true, required: true},
    description: { type: String, lowercase: true},
    date: { type: Date, default:Date.now},
    userid:{type:String,required:true,lowercase: true },
    iscompleted:{type:Boolean, default: false},
    subgroup:{type:String, lowercase:true}
});

module.exports = mongoose.model('Task',TaskSchema);
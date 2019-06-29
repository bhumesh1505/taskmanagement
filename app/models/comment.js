var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    comment: { type: String, lowercase: true},
    rating: { type: String, lowercase: true},
    date: { type: Date, default:Date.now},
    userid:{type:String,required:true,lowercase: true}
});

module.exports = mongoose.model('Comment',CommentSchema);
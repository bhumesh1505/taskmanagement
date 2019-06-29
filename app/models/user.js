var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: { type: String, lowercase: true, required: true},
	username: { type: String, lowercase: true, required: true, unique: true },
	email: { type: String, lowercase: true, required: true, unique: true },
	password: { type: String, required: true},
	userid:{type:String,required:true,unique: true,lowercase: true },
	contact:{type:String,required:true,unique: true},
	gender:{type:String,required:true,lowercase: true },
	type:{type:String,lowercase:true,required:true},
	juniors:{type:[String]},
	seniors:{type:[String]}
});

UserSchema.pre('save', function(next){
	var user = this;
	bcrypt.hash(user.password,null,null, function(err,hash){
		if(err) return next(err);
		user.password = hash;
		next();
	});
});

UserSchema.methods.comparePassword = function(password){
	return bcrypt.compareSync(password,this.password);
};

module.exports = mongoose.model('User', UserSchema);
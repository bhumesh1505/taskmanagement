var User 		= require('../models/user'),
	Comment 	= require('../models/comment'),
	Task 		= require('../models/task'),
	jwt 		= require('jsonwebtoken'),
	secret      = 'secret',
	url         = require('url');

module.exports = function(router){

    // register users
    router.post('/register', function(req,res){
        var user = new User();
        user.name = req.body.name;
        user.username = req.body.username;
        user.email = req.body.email;
        user.password = req.body.password;
        user.userid = req.body.userid;
        user.contact = req.body.contact;
        user.gender = req.body.gender;
        user.type = "user";

        if(!req.body.name || !req.body.username || !req.body.email ||  !req.body.password || !req.body.userid || !req.body.contact || !req.body.gender){
            res.json({success:false,msg:'Ensure all information were provided'});
        }
        else{
            user.save(function(err){
                if(err) {
                    res.json({success:false,msg:'username or email or userid or contact is already exists !'});
                }
                else{
                    res.json({success:true,msg:'user created !'});
                }
            });
        }
    });

    // login user
    router.post('/login', function(req,res){
        if(!(req.body.username || req.body.userid || req.body.email || req.body.contact ) || !req.body.password){
            res.json({success:false,msg:'Ensure username and password were provided'});
        }
        else{
            var obj = {};
            if(req.body.username){
                obj.username = req.body.username;
            }
            else if(req.body.userid){
                obj.userid = req.body.userid;
            }
            else if(req.body.email){
                obj.email = req.body.email;
            }
            else if(req.body.contact){
                obj.contact = req.body.contact;
            }

            User.findOne( obj ).select('type name username email password userid contact gender').exec(function(err, user) {
                if(err) throw err;
                if(!user){
                    res.json({success:false, msg:'Could not authenticate user'})
                }
                else if(user){
                    var validPassword = user.comparePassword(req.body.password);
                    if(!validPassword){
                        res.json({success:false, msg: 'Could not authenticate password'})
                    }
                    else{
                        var token = jwt.sign({name:user.name, username: user.username, email: user.email, userid: user.userid, contact:user.contact, gender:user.gender ,type: user.type },secret,{expiresIn:'24h'} );
                        res.json({success:true, msg: 'User authenticate!', token: token});
                    }
                }
            });
        }
    });
	
	// post task for a userid
    router.post('/task', function(req,res){
        var task = new Task();

        task.name = req.body.name;
        task.description = req.body.description;
        task.userid = req.body.userid;

        if(!req.body.name || !req.body.userid){
            res.json({success:false,msg:'Ensure all information were provided'});
        }
        else{
            task.save(function(err){
                if(err) {
                    res.json({success:false,msg:'Could not create task'});
                }
                else{
                    res.json({success:true,msg:'task created !'});
                }
            });
        }
    });
	
	// get all tasks for a userid
    router.get('/tasks', function(req,res){
		var params = url.parse(req.url, true).query
        if(!params.userid){
            res.json({success:false,msg:'userid not provided'});
        } else {
            Task.find( {userid: params.userid} ).exec(function(err, tasks) {
                if(err) throw err;
                else res.json({tasks:tasks});
            });
        }
	});
	
	// post comment for a userid
    router.post('/comment', function(req,res){
        var comment = new Comment();

        comment.comment = req.body.comment;
        comment.rating = req.body.rating;
        comment.userid = req.body.userid;

        if(!req.body.comment || !req.body.userid){
            res.json({success:false,msg:'Ensure all information were provided'});
        } else {
            comment.save(function(err){
                if(err) {
                    res.json({success:false,msg:'Could not post comment'});
                }
                else{
                    res.json({success:true,msg:'commented!'});
                }
            });
        }
    });

	// get all comments for a userid
    router.get('/comments', function(req,res){
		var params = url.parse(req.url, true).query
        if(!params.userid){
            res.json({success:false,msg:'userid not provided'});
        } else {
            Comment.find( {userid: params.userid} ).exec(function(err, comments) {
                if(err) throw err;
                else res.json({comments:comments});
            });
        }
	});
	
	// create user juniors mapping
	router.post('/junior', function(req,res){
		var userid = req.body.userid;
		var juniorid = req.body.juniorid;

		if(!req.body.userid || !req.body.juniorid){
			res.json({success:false,msg:'Ensure all information were provided'});
		} else {
			User.updateOne({userid:userid}, {"$push": {"juniors": juniorid}},{ "upsert": true }).exec(function(err, user) {
				if(err) throw err;
				// else res.json({success:true,msg:'junior added!'});
			})
			User.findOneAndUpdate({userid:juniorid}, {$push: {seniors: userid}}).exec(function(err, user) {
				if(err) throw err;
				else res.json({success:true,msg:'junior added!'});
			})
		}
	});

	// get junior's details with a juniorid
	router.get('/junior', function(req,res){
		var params = url.parse(req.url, true).query
        if(!params.userid){
            res.json({success:false,msg:'userid not provided'});
        } else {
			User.find({userid:params.userid}).exec(function(err, juniorData){
				if(err) throw err;
				else res.json({juniorData: juniorData});
			})
        }
	});

    router.use(function(req,res,next){
        var token = req.body.token || req.body.query || req.headers['x-access-token'];
        if(token){
            jwt.verify(token, secret, function(err, decoded){
               if(err){
                   res.json({success:false, msg: 'Token Invalid'});
               }
               else {
                    req.decoded = decoded;
                    next();
               }
            });
        }
        else{
            res.json({success:false, msg: 'No Token provided'});
        }
    });

    router.post('/me' , function(req,res){
        res.send(req.decoded);
    });

    return router;
}
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
		var params = url.parse(req.url, true).query;
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
		var params = url.parse(req.url, true).query;
        if(!params.userid){
            res.json({success:false,msg:'userid not provided'});
        } else {
            Comment.find( {userid: params.userid} ).exec(function(err, comments) {
                if(err) throw err;
                else res.json({comments:comments});
            });
        }
	});
	
	// mapping between junior and senior
	router.post('/mapping', function(req,res){
		var seniorid = req.body.seniorid;
		var juniorid = req.body.juniorid;
        if(!req.body.seniorid || !req.body.juniorid){
			res.json({success:false,msg:'Ensure all both ids were provided'});
		} else {
            var ids = [];
            ids.push(seniorid);
            ids.push(juniorid);
            User.find({userid:{"$in":ids}}).exec(function(err, user) {
                if(err) throw err;
                else if(user.length == 2){ // if both users are present then only map
                    User.updateOne({userid:seniorid}, {"$push": {"juniors": juniorid}},{ "upsert": true }).exec(function(err, user) {
                        if(err) throw err;
                        else{
                            User.updateOne({userid:juniorid}, {"$push": {"seniors": seniorid}},{ "upsert": true }).exec(function(err, user) {
                                if(err) throw err;
                                else res.json({success:true,msg:'Junior/Senior added!'});
                            })
                        }
                    })
                } else {
                    res.json({success:false,msg:'failed to add Junior/Senior!'});
                }
            });
		}
	});

    // get user's details
    router.get('/user', function(req,res){
        var params = url.parse(req.url, true).query
        if(!params.userid){
            res.json({success:false,msg:'userid not provided'});
        } else {
            User.findOne({userid:params.userid}).exec(function(err, data){
                if(err){ throw err; }
                else {
                    res.json({data: data});
                }
            })
        }
    });

    // get user's details
    router.get('/users', function(req,res){
        var params = url.parse(req.url, true).query
        if(!params.userid){
            res.json({success:false,msg:'userid not provided'});
        } else {
            var stringIds = params.userid;
            var ids = stringIds.split(',');
            User.find({userid:{"$in":ids}}).exec(function(err, data){
                if(err){ throw err; }
                else {
                    res.json({success: true,data: data});
                }
            })
        }
    });

    // get junior's ids
    router.get('/juniorsid', function(req,res){
        var params = url.parse(req.url, true).query
        if(!params.userid){
            res.json({success:false,msg:'userid not provided'});
        } else {
            User.findOne({userid:params.userid}).exec(function(err, juniorData){
                if(err){ throw err; }
                else {
                    res.json({success: true, juniors: juniorData.juniors});
                }
            })
        }
    });

    // get junior's id
    router.get('/seniorsid', function(req,res){
        var params = url.parse(req.url, true).query
        if(!params.userid){
            res.json({success:false,msg:'userid not provided'});
        } else {
            User.findOne({userid:params.userid}).exec(function(err, data){
                if(err){ throw err; }
                else {
                    res.json({success: true, seniors: data.seniors});
                }
            })
        }
    });

    // check if given id is junior of given userid
    router.get('/isjuniorof', function(req,res){
        var params = url.parse(req.url, true).query
        if(!params.userid){
            res.json({success:false,msg:'userid not provided'});
        } else {
            var userid = params.userid;
            var juniorid = params.juniorid;

            User.findOne({userid:userid}).exec(function(err, data){
                if(err){
                    throw err;
                } else {
                    if(data.juniors.find( function(id){ return id == juniorid }) ){
                        res.json({success: true,found: true});
                    }
                    else{
                        res.json({success: true,found: false});
                    }

                }
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
        res.json({success:true, data: req.decoded});
    });


    return router;
}
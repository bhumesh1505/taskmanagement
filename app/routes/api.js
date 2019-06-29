var express 	= require('express');
var app 		= express();
var User 		= require('../models/user');
var Comment 	= require('../models/comment');
var Task 		= require('../models/task');
var jwt 		= require('jsonwebtoken');
var secret      = 'secret';
var bodyParser	= require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

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

    router.post('/createtask', function(req,res){
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


    router.post('/comment', function(req,res){
        var comment = new Comment();

        comment.comment = req.body.comment;
        comment.rating = req.body.rating;
        comment.userid = req.body.userid;

        if(!req.body.comment || !req.body.userid){
            res.json({success:false,msg:'Ensure all information were provided'});
        }
        else{
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

    router.get('/comment', function(req,res){

        var userid = req.body.userid;
        console.log(req);
        if(!userid){
            res.json({success:false,msg:'userid not provided'});
        }
        else{
            Comment.find( {userid:userid} ).exec(function(err, comments) {
                if(err) throw err;
                else res.json({comments:comments});
            });
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
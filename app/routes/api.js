var User 		= require('../models/user'),
	Comment 	= require('../models/comment'),
	Task 		= require('../models/task'),
    Department 	= require('../models/department'),
    Group 		= require('../models/group'),
    Subgroup 	= require('../models/subgroup'),
    Activity = require('../models/activity'),
    jwt 		= require('jsonwebtoken'),
	secret      = 'secret',
	url         = require('url');

module.exports = function(router){

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
                        res.json({success:true, msg: 'User authenticate!', token: token , data: user});
                    }
                }
            });
        }
    });

    // register admin
    router.post('/registeradmin', function(req,res){
        var user = new User();
        user.name = req.body.name;
        user.username = req.body.username;
        user.email = req.body.email;
        user.password = req.body.password;
        user.userid = req.body.userid;
        user.contact = req.body.contact;
        user.gender = req.body.gender;
        user.type = "admin" ;
        var authsecret = "y0l0adm1n";

        if(!req.body.authsecret || !req.body.name || !req.body.username || !req.body.email ||  !req.body.password || !req.body.userid || !req.body.contact || !req.body.gender ){
            res.json({success:false,msg:'Ensure all information were provided'});
        }
        else{
            if(authsecret == req.body.authsecret){
                user.save(function(err){
                    if(err) {
                        res.json({success:false,msg:'username or email or userid or contact is already exists !'});
                    }
                    else{
                        res.json({success:true,msg:'admin created !'});
                    }
                });
            } else {
                res.json({success:false,msg:'Could not create admin !'});
            }

        }
    });

    //middleware to ckeck token is valid or not
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

	// post task for a userid
    router.post('/task', function(req,res){
        var task = new Task();

        task.name = req.body.name;
        task.description = req.body.description;
        task.userid = req.body.userid;
        task.iscompleted = false;

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
            Task.aggregate( [
                { $match : { userid : params.userid }},
                { $sort: { date: -1 } }
            ]).exec(function(err, data){
                if(err){ throw err; }
                else {
                    res.json({success: true,tasks: data});
                }
            });
        }
	});

    //get all users
    router.get('/allusers', function(req,res){

        User.find({}).exec(function(err, data){
            if(err){ throw err; }
            else {
                res.json({success: true,data: data});
            }
        })
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
            Comment.aggregate( [
                { $match : { userid : params.userid }},
                { $sort: { date: -1 } }
            ]).exec(function(err, comments){
                if(err){ throw err; }
                else {
                    res.json({success: true, comments: comments});
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

    // get users details
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
                else if(juniorData){
                    res.json({success: true, juniors: juniorData.juniors});
                }
                else{
                    res.json({success: false, msg: "failed !"});
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
                else if(data){
                    res.json({success: true, seniors: data.seniors});
                }
                else{
                    res.json({success: false, msg: "Failed !"});
                }
            })
        }
    });

    // check if given task is completed or not
    router.get('/istaskcompleted', function(req,res){
        var params = url.parse(req.url, true).query;
        if(!params.taskid){
            res.json({success:false,msg:'taskid not provided'});
        } else {
            var taskid = params.taskid;

            Task.findOne({_id:taskid}).exec(function(err, data){
                if(err){
                    throw err;
                } else if(data){
                    console.log(data);
                    if(data.iscompleted != undefined && data.iscompleted == true){
                        res.json({success: true, data: data , iscompleted: true});
                    }
                    else {
                        res.json({success: true, data: data , iscompleted: false});
                    }
                }
                else {
                    res.json({success: false, iscompleted: true});
                }
            })
        }
    });

    // make task completed, task id will be passed
    router.post('/istaskcompleted', function(req,res){
        var taskid = req.body.taskid;
        var status = req.body.status;
        var date = req.body.date;
        var d = new Date();

        if(!taskid){
            res.json({success:false, msg:'task id not provided'});
        } else {
            // if given task is todays task
            if(d.getDate() == date.day && d.getFullYear() == date.year && d.getMonth() == date.month){
                Task.updateOne({_id:taskid},  {$set:{"iscompleted": status }}).exec(function(err, data) {
                    if(err) throw err;
                    else{
                        res.json({success:true,msg:'Updated !'});
                    }
                })
            } else {
                res.json({success: true, msg:"Task expired !"});
            }
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
                } else if(data){
                    if(data.juniors.find( function(id){ return id == juniorid }) ){
                        res.json({success: true,found: true});
                    }
                    else {
                        res.json({success: true,found: false});
                    }
                }
                else {
                    res.json({success: false,found: false});
                }
            })
        }
    });

    // get the information about user from token
    router.post('/me' , function(req,res){
        res.json({success:true, data: req.decoded});
    });

    //middleware to check if it's admin or not
    router.use(function(req,res,next){
        var params = url.parse(req.url, true).query;
        var adminid = req.body.adminid || params.adminid;
        if(!adminid){
            res.json({success:false,msg:'Admin id not provided'});
        } else {
            User.findOne( {userid:adminid} ).select('type').exec(function(err, user) {
                if(err) throw err;
                if(!user){
                    res.json({success:false, msg:'Could not authenticate user'});
                }
                else if(user){
                    if(user.type == 'admin'){
                        next();
                    } else {
                        res.json({success:false, msg:"you don't have permission"});
                    }
                }
            });
        }
    });

    // mapping between junior and senior
    router.post('/mapping', function(req,res){
        var seniorid = req.body.seniorid;
        var juniorid = req.body.juniorid;
        //var userid = req.body.userid; // which will perform this operation
        //user who is going to perform this operation must be admin

        if(!req.body.seniorid || !req.body.juniorid){
            res.json({success:false,msg:'Ensure both ids were provided'});
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

    // remove mapping between junior and senior
    router.post('/removemapping', function(req,res){
        var seniorid = req.body.seniorid;
        var juniorid = req.body.juniorid;
        //user who is going to perform this operation must be admin

        if(!req.body.seniorid || !req.body.juniorid){
            res.json({success:false,msg:'Ensure both ids were provided'});
        } else {
            var ids = [];
            ids.push(seniorid);
            ids.push(juniorid);
            User.find({userid:{"$in":ids}}).exec(function(err, user) {
                if(err) throw err;
                else if(user.length == 2){ // if both users are present then only map
                    User.updateOne({userid:seniorid}, {"$pull": {"juniors": juniorid}},{ "multi": true }).exec(function(err, user) {
                        if(err) throw err;
                        else{
                            User.updateOne({userid:juniorid}, {"$pull": {"seniors": seniorid}},{ "multi": true }).exec(function(err, user) {
                                if(err) throw err;
                                else res.json({success:true,msg:'Junior/Senior removed!'});
                            })
                        }
                    })
                } else {
                    res.json({success:false,msg:'failed to add Junior/Senior!'});
                }
            });
        }
    });

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
        user.type = "user" ;

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

    // isemployeeactive set new status
    router.post('/isemployeeactive', function(req,res){
        var userid = req.body.userid;
        var status = req.body.status;

        if(!userid){
            res.json({success:false, msg:'user id not provided'});
        } else {
            User.updateOne({userid:userid}, {$set:{"isactive": status }}).exec(function(err, data) {
                if(err) throw err;
                else{
                    res.json({success:true, msg:'Updated !'});
                }
            })
        }
    });

    // add department
    router.post('/department', function(req,res){

        if(!req.body.departmentname){
            res.json({success:false, msg:'department name not provided'})
        } else {
            var department = new Department();
            department.departmentname = req.body.departmentname;
            department.save(function(err){
                if(err) {
                    res.json({success:false, msg:'department already exists !'});
                }
                else{
                    res.json({success:true,msg:'department created !'});
                }
            });
        }
    });

    // add group
    router.post('/group', function(req,res){

        if(!req.body.department || !req.body.groupname){
            res.json({success:false, msg:'Ensure all information were provided!'})
        } else {
            var group = new Group();
            group.department = req.body.department;
            group.groupname = req.body.groupname;
            group.save(function(err){
                if(err) {
                    res.json({success:false, msg:'already exists !'});
                }
                else{
                    res.json({success:true,msg:'Group created !'});
                }
            });
        }
    });

    // add subgroup
    router.post('/subgroup', function(req,res){

        if(!req.body.group || !req.body.subgroupname){
            res.json({success:false, msg:'Ensure all information were provided!'})
        } else {
            var subgroup = new Subgroup();
            subgroup.group = req.body.group;
            subgroup.subgroupname = req.body.subgroupname;
            subgroup.save(function(err){
                if(err) {
                    res.json({success:false, msg:'already exists !'});
                }
                else{
                    res.json({success:true,msg:'Subgroup created !'});
                }
            });
        }
    });

    // get departments
    router.get('/departments', function(req,res){
        Department.aggregate( [
            { $sort: { departmentname: -1 } }
        ]).exec(function(err, data){
            if(err){ throw err; }
            else {
                res.json({success: true, departments: data});
            }
        });
    });

    // get groups
    router.get('/groups', function(req,res){
        var params = url.parse(req.url, true).query;
        if(!params.department){
            res.json({success:false,msg:'department not provided'});
        } else {
            Group.aggregate( [
                { $match : { department : params.department }},
                { $sort: { date: -1 } }
            ]).exec(function(err, data){
                if(err){ throw err; }
                else {
                    res.json({success: true, groups: data});
                }
            });
        }
    });

    // get subgroup
    router.get('/subgroups', function(req,res){
        var params = url.parse(req.url, true).query;
        if(!params.group){
            res.json({success:false,msg:'Group not provided'});
        } else {
            Subgroup.aggregate( [
                { $match : { group : params.group }},
                { $sort: { date: -1 } }
            ]).exec(function(err, data){
                if(err){ throw err; }
                else {
                    res.json({success: true, subgroups: data});
                }
            });
        }
    });

    //add activity
    router.post('/addactivity', function(req,res){
        var activityname = req.body.activityname;
        var departmentname = req.body.departmentname;
        var groupname = req.body.groupname;
        var subgroupname = req.body.subgroupname;

        var activity = new Activity();
        var subgroup = new Subgroup();
        var group = new Group();
        var department = new Department();

        if(activityname){
            activity.activityname = activityname;
        }

        if(subgroupname){
            subgroup.subgroupname = subgroupname;
            if(activityname){
                subgroup.activities.push(activity);
            }
        }

        if(groupname){
            group.groupname = groupname;
            if(subgroupname){
                group.subgroups.push(subgroup);
            }
        }

        if(departmentname){
            department.departmentname = departmentname;
            if(groupname){
                department.groups.push(group);
            }
        }

        if(departmentname) {
            Department.findOne({departmentname: departmentname}).select('departmentname groups').exec(function (err, data) {
                if (data) {
                    if(groupname) {
                        var foundGroup = data.groups.find(function (groupX) {return groupX.groupname == groupname}); // will return object ob group
                        if (foundGroup) {
                            if(subgroupname) {
                                var foundSubgroup = foundGroup.subgroups.find(function (subgroupX) {return subgroupX.subgroupname == subgroupname});
                                if (foundSubgroup) {
                                    if(activityname) {
                                        var foundActivity = foundSubgroup.activities.find(function (activityX) {
                                            return activityX.activityname == activityname
                                        });
                                        if (foundActivity) {
                                            res.json({success: false, msg: "Activity already exists!"});
                                        }
                                        else { // update department, group, subgroup by adding new activity
                                            /*if(activityname) {
                                                Department.findOne({
                                                    "departmentname": departmentname,
                                                    "groups.groupname": groupname,
                                                    "groups.subgroups.subgroupname": subgroupname
                                                }).exec(function (err, user) {
                                                    if (err) throw err;
                                                    else {
                                                        console.log(user);
                                                        res.json({
                                                            success: true,
                                                            msg: "Activity created successfully!"
                                                        });
                                                    }
                                                });
                                            }*/
                                            if (activityname) {
                                                Department.updateOne({
                                                    "departmentname": departmentname,
                                                    "groups.groupname": groupname
                                                }, {"$pull": {"groups.$.subgroups": foundSubgroup}}, {"multi": true}).exec(function (err, user) {
                                                    if (err) throw err;
                                                    else {
                                                        foundSubgroup.activities.push(activity);
                                                        Department.updateOne({
                                                            "departmentname": departmentname,
                                                            "groups.groupname": groupname
                                                        }, {"$push": {"groups.$.subgroups": foundSubgroup}}, {"upsert": true}).exec(function (err, user) {
                                                            if (err) throw err;
                                                            else {
                                                                res.json({
                                                                    success: true,
                                                                    msg: "Activity created successfully!"
                                                                });
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        }
                                    }
                                }
                                else {    //update department and group by adding new subgroup
                                    Department.updateOne({
                                        "departmentname": departmentname,
                                        "groups.groupname": groupname
                                    }, {"$push": {"groups.$.subgroups": subgroup}}, {"upsert": true}).exec(function (err, user) {
                                        if (err) throw err;
                                        else {
                                            res.json({success: true, msg: "Subgroup created successfully!"});
                                        }
                                    })
                                }
                            }
                        }
                        else { // update department by adding new group
                            Department.updateOne({departmentname: departmentname}, {"$push": {"groups": group}}, {"upsert": true}).exec(function (err, user) {
                                if (err) throw err;
                                else {
                                    res.json({success: true, msg: "Group created successfully!"});
                                }
                            })
                        }
                    }
                } else {    // department not found then insert new one
                    department.save(function (err) {
                        if (err) {
                            res.json({success: false, msg: "already exists!"});
                        } else {
                            res.json({success: true, msg: "created successfully!"});
                        }
                    })
                }
            });
        } else {
            res.json({success: false, msg: "departmentname not provided!"});
        }
    });

    //get alldata of departments
    router.get('/getdepartments', function(req, res){
        Department.find({},function(err, data){
            if(err){ throw err; }
            else {
                res.json({success: true, departments: data});
            }
        });
    });

    return router;
};
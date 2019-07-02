angular.module('userControllers',[])
    .controller('regCtrl', function($scope,$http,$location,$timeout,User) {

            $scope.successMsg = false;
            $scope.errorMsg = false;

            $scope.regUser = function(userData){
                $scope.successMsg = false;
                $scope.errorMsg = false;
                User.create(userData).then(function(data){
                    if(data.data.success)
                    {
                        $scope.successMsg = data.data.msg;
                        $timeout(function(){
                            $location.path('/login');
                        },500);
                    }
                    else
                    {
                        $scope.errorMsg = data.data.msg;
                    }
                })
            }
    })
    .controller('profileCtrl', function($scope,$http,$location,$timeout,User,Auth) {
        $scope.gotComments = false;

        var errorcallback = function(data){
        }

    })
    .controller('tasksCtrl', function($scope,$http,$location,$timeout,User,Auth) {
        $scope.gotTasks = false;
        $scope.tasksheander = ['Name','Description','Date'];
        $scope.taskskeys = ['name','description','date'];
        var successcallbacktasks = function(data){
            $scope.tasksData = data.tasks;
            $scope.gotTasks = true;
        };

        var errorcallback = function(data){
        };
        Auth.getTasks($scope.userdetails.userid,successcallbacktasks,errorcallback);

        $scope.addTask = function(name,description){
            var successcallbackaddtask = function(data){
                if(data.success){
                    document.getElementById("closeTaskAdd").click();
                    $scope.taskdescription = "";
                    $scope.taskname = "";
                    Auth.getTasks($scope.userdetails.userid,successcallbacktasks,errorcallback);
                }
            };
            Auth.addTask(name,description,$scope.userdetails.userid,successcallbackaddtask,errorcallback);
        }

    })
    .controller('commentsCtrl', function($scope,$http,$location,$timeout,User,Auth) {
        $scope.gotComments = false;
        $scope.commentsheander = ['Comment','Date','Rating'];
        $scope.commentskeys = ['comment','date','rating'];
        var successcallbackcomments = function(data){
            $scope.commentsData = data.comments;
            $scope.gotComments = true;
        };

        var errorcallback = function(data){
        }
        Auth.getComments($scope.userdetails.userid,successcallbackcomments,errorcallback);

    })
    .controller('juniorsCtrl', function($scope,$http,$location,$timeout,User,Auth) {
        $scope.gotJuniors = false;
        $scope.juniorsheander = ['Name','Userid','Email','Contact'];
        $scope.juniorskeys = ['name','userid','email','contact'];

        var errorcallback = function(data){
        };

        var successcallbackjuniorsids = function(data){
            var i;
            var ids = "";
            for(i=0;i<data.juniors.length;i++){
                var id = data.juniors[i];
                if(i < data.juniors.length - 1){
                    ids = ids + id + ",";
                }
                else{
                    ids = ids + id ;
                }
            }
            var successcallbackjuniors = function(data){
                $scope.juniorsData = data.data;
                $scope.gotJuniors = true;
            };
            Auth.getUserDetailsUsingIds(ids,successcallbackjuniors,errorcallback);
        };

        Auth.getJuniorsId($scope.userdetails.userid,successcallbackjuniorsids,errorcallback);

        $scope.viewUser = function(userid){
            $location.path('/junior/'+userid);
        }

    })
    .controller('seniorsCtrl', function($scope,$http,$location,$timeout,User,Auth) {

        $scope.gotSeniors = false;
        $scope.seniorsheander = ['Name','Userid','Email','Contact'];
        $scope.seniorskeys = ['name','userid','email','contact'];

        var errorcallback = function(data){
        };

        var successcallbackseniorsids = function(data){
            var i;
            var ids = "";
            for(i=0;i<data.seniors.length;i++){
                var id = data.seniors[i];
                if(i < data.seniors.length - 1){
                    ids = ids + id + ",";
                }
                else{
                    ids = ids + id ;
                }
            }
            var successcallbackseniors = function(userdata){
                $scope.seniorsData = userdata.data;
                $scope.gotSeniors = true;
            };
            Auth.getUserDetailsUsingIds(ids,successcallbackseniors,errorcallback);
        };

        Auth.getSeniorsId($scope.userdetails.userid,successcallbackseniorsids,errorcallback);

    })
    .controller('viewJuniorCtrl', function($scope,$http,$location,$timeout,User,Auth,$routeParams) {



        $scope.juniorid = $routeParams.userid;

        $scope.juniorsheander = ['Name','Userid','Email','Contact'];
        $scope.juniorskeys = ['name','userid','email','contact'];
        $scope.userinfo = {};

        var errorcallback = function(data){
        };

        var successcallbackdetails = function(data){
            $scope.userinfo.name = data.data.name;
            $scope.userinfo.username = data.data.username;
            $scope.userinfo.email = data.data.email;
            $scope.userinfo.gender = data.data.gender;
            $scope.userinfo.contact = data.data.contact;
            $scope.userinfo.userid = data.data.userid;
        };
        Auth.getUserDetailsUsingId($routeParams.userid,successcallbackdetails,errorcallback);

        $scope.gotTasks = false;
        $scope.tasksheander = ['Name','Description','Date'];
        $scope.taskskeys = ['name','description','date'];
        var successcallbacktasks = function(data){
            $scope.tasksData = data.tasks;
            $scope.gotTasks = true;
        };
        Auth.getTasks($routeParams.userid,successcallbacktasks,errorcallback);


        $scope.gotComments = false;
        $scope.commentsheander = ['Comment','Date','Rating'];
        $scope.commentskeys = ['comment','date','rating'];
        var successcallbackcomments = function(data){
            $scope.commentsData = data.comments;
            $scope.gotComments = true;
        };
        Auth.getComments($routeParams.userid,successcallbackcomments,errorcallback);


        $scope.gotJuniors = false;
        $scope.juniorsheander = ['Name','Userid','Email','Contact'];
        $scope.juniorskeys = ['name','userid','email','contact'];
        var successcallbackjuniorsids = function(data){
            var i;
            var ids = "";
            for(i=0;i<data.juniors.length;i++){
                var id = data.juniors[i];
                if(i < data.juniors.length - 1){
                    ids = ids + id + ",";
                }
                else{
                    ids = ids + id ;
                }
            }
            var successcallbackjuniors = function(data){
                $scope.juniorsData = data.data;
                $scope.gotJuniors = true;
            };
            Auth.getUserDetailsUsingIds(ids,successcallbackjuniors,errorcallback);
        };
        Auth.getJuniorsId($routeParams.userid,successcallbackjuniorsids,errorcallback);


        $scope.gotSeniors = false;
        $scope.seniorsheander = ['Name','Userid','Email','Contact'];
        $scope.seniorskeys = ['name','userid','email','contact'];
        var successcallbackseniorsids = function(data){
            var i;
            var ids = "";
            for(i=0;i<data.seniors.length;i++){
                var id = data.seniors[i];
                if(i < data.seniors.length - 1){
                    ids = ids + id + ",";
                }
                else{
                    ids = ids + id ;
                }
            }
            var successcallbackseniors = function(userdata){
                $scope.seniorsData = userdata.data;
                $scope.gotSeniors = true;
            };
            Auth.getUserDetailsUsingIds(ids,successcallbackseniors,errorcallback);
        };
        Auth.getSeniorsId($routeParams.userid,successcallbackseniorsids,errorcallback);

        $scope.submitComment = function(comment,rating){
            var successcallback = function(data2){
                if(data2.success == true) {
                    var successcallbackcomments = function (data) {
                        $scope.commentsData = data.comments;
                        $scope.gotComments = true;
                        $scope.comment = "";
                        $scope.rating = "";
                    };
                    Auth.getComments($routeParams.userid, successcallbackcomments, errorcallback);
                }
            };
            Auth.submitComment(comment,rating,$routeParams.userid,successcallback,errorcallback);
        }

    })
;
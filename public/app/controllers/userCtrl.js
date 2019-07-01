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
        }
        Auth.getTasks($scope.userdetails.userid,successcallbacktasks,errorcallback);

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

        var juniorsDetails = [];
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
                console.log(data.data);
                $scope.gotJuniors = true;
            }
            Auth.getUserDetailsUsingIds(ids,successcallbackjuniors,errorcallback);
        };

        var errorcallback = function(data){
        }
        Auth.getJuniorsId($scope.userdetails.userid,successcallbackjuniorsids,errorcallback);

    })

;
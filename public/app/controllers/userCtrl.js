angular.module('userControllers',[])

    .controller('regCtrl', function($scope,$http,$location,$timeout,User) {
        if($scope.isLoggedIn){
            $location.path('/profile');
        } else {
            $scope.successMsg = false;
            $scope.errorMsg = false;

            $scope.regUser = function (userData) {
                $scope.successMsg = false;
                $scope.errorMsg = false;
                User.create(userData).then(function (data) {
                    $scope.showNotification(data.data.msg,data.data.success);
                    if (data.data.success) {
                        $scope.successMsg = data.data.msg;
                        $timeout(function () {
                            $location.path('/login');
                        }, 500);
                    }
                    else {
                        $scope.errorMsg = data.data.msg;
                    }
                })
            }
        }
    })
    .controller('loginCtrl', function($scope,$http,$location,$timeout,User) {
        if($scope.isLoggedIn){
            $location.path('/profile');
        } else {
        }
    })

    .controller('profileCtrl', function($scope,$http,$location,$timeout,User,Auth) {
        if(!($scope.isLoggedIn)){
            $location.path('/login');
        }
        else {

        }
    })
    .controller('tasksCtrl', function($scope,$http,$location,$timeout,User,Auth) {
        if(!($scope.isLoggedIn)){
            $location.path('/login');
        }
        else {
            $scope.gotTasks = false;
            $scope.tasksheander = ['Name', 'Description', 'Date'];
            $scope.taskskeys = ['name', 'description', 'date'];
            var successcallbacktasks = function (data) {
                $scope.tasksData = data.tasks;
                $scope.gotTasks = true;
            };

            var errorcallback = function (data) {
            };
            Auth.getTasks($scope.userdetails.userid, successcallbacktasks, errorcallback);

            $scope.addTask = function (name, description) {
                var successcallbackaddtask = function (data) {
                    $scope.showNotification(data.msg, data.success);
                    if (data.success) {
                        document.getElementById("closeTaskAdd").click();
                        $scope.taskdescription = "";
                        $scope.taskname = "";
                        Auth.getTasks($scope.userdetails.userid, successcallbacktasks, errorcallback);
                    }
                };
                Auth.addTask(name, description, $scope.userdetails.userid, successcallbackaddtask, errorcallback);
            }
        }
    })

    .controller('commentsCtrl', function($scope,$http,$location,$timeout,User,Auth) {
        if(!($scope.isLoggedIn)){
            $location.path('/login');
        }
        else {
            $scope.gotComments = false;
            $scope.commentsheander = ['Comment', 'Date', 'Rating'];
            $scope.commentskeys = ['comment', 'date', 'rating'];
            $scope.averageRating = 0;
            var successcallbackcomments = function (data) {
                $scope.commentsData = data.comments;
                if ($scope.commentsData) {
                    for (var i = 0; i < $scope.commentsData.length; i++) {
                        $scope.averageRating += parseFloat($scope.commentsData[i].rating);
                    }
                    if ($scope.commentsData.length > 0) {
                        $scope.averageRating = $scope.averageRating / $scope.commentsData.length;
                    }
                    $scope.averageRating = $scope.averageRating.toFixed(2);
                }
                $scope.gotComments = true;
            };

            var errorcallback = function (data) {
            };
            Auth.getComments($scope.userdetails.userid, successcallbackcomments, errorcallback);
        }

    })

    .controller('juniorsCtrl', function($scope,$http,$location,$timeout,User,Auth) {

        if(!($scope.isLoggedIn)){
            $location.path('/login');
        }
        else {
            $scope.gotJuniors = false;
            $scope.juniorsheander = ['Name', 'Userid', 'Email', 'Contact'];
            $scope.juniorskeys = ['name', 'userid', 'email', 'contact'];

            var errorcallback = function (data) {
            };

            var successcallbackjuniorsids = function (data) {
                var i;
                var ids = "";
                for (i = 0; i < data.juniors.length; i++) {
                    var id = data.juniors[i];
                    if (i < data.juniors.length - 1) {
                        ids = ids + id + ",";
                    }
                    else {
                        ids = ids + id;
                    }
                }
                if (ids.length > 0) {
                    var successcallbackjuniors = function (data) {
                        $scope.juniorsData = data.data;
                        $scope.gotJuniors = true;
                    };
                    Auth.getUserDetailsUsingIds(ids, successcallbackjuniors, errorcallback);
                }
            };

            Auth.getJuniorsId($scope.userdetails.userid, successcallbackjuniorsids, errorcallback);

            $scope.viewUser = function (userid) {
                $location.path('/junior/' + userid);
            };

            $scope.addJunior = function (juniorid) {
                var successcallbackmap = function (data) {
                    $scope.showNotification(data.msg, data.success);
                    if (data.success) {
                        $scope.juniorid = "";
                        Auth.getJuniorsId($scope.userdetails.userid, successcallbackjuniorsids, errorcallback);
                    }
                };
                Auth.mappingJuniorSenior(juniorid, $scope.userdetails.userid, successcallbackmap, errorcallback);
            };
        }
    })

    .controller('seniorsCtrl', function($scope,$http,$location,$timeout,User,Auth) {

        if(!($scope.isLoggedIn)){
            $location.path('/login');
        }
        else {
            $scope.gotSeniors = false;
            $scope.seniorsheander = ['Name', 'Userid', 'Email', 'Contact'];
            $scope.seniorskeys = ['name', 'userid', 'email', 'contact'];

            var errorcallback = function (data) {
            };

            var successcallbackseniorsids = function (data) {
                var i;
                var ids = "";
                for (i = 0; i < data.seniors.length; i++) {
                    var id = data.seniors[i];
                    if (i < data.seniors.length - 1) {
                        ids = ids + id + ",";
                    }
                    else {
                        ids = ids + id;
                    }
                }
                var successcallbackseniors = function (userdata) {
                    $scope.seniorsData = userdata.data;
                    $scope.gotSeniors = true;
                };
                Auth.getUserDetailsUsingIds(ids, successcallbackseniors, errorcallback);
            };

            Auth.getSeniorsId($scope.userdetails.userid, successcallbackseniorsids, errorcallback);


            $scope.addSenior = function (seniorid) {
                var successcallbackmap = function (data) {
                    $scope.showNotification(data.msg, data.success);
                    if (data.success) {
                        $scope.seniorid = "";
                        Auth.getSeniorsId($scope.userdetails.userid, successcallbackseniorsids, errorcallback);
                    }
                };
                Auth.mappingJuniorSenior($scope.userdetails.userid, seniorid, successcallbackmap, errorcallback);
            };
        }
    })

    .controller('viewJuniorCtrl', function($scope,$http,$location,$timeout,User,Auth,$routeParams) {

        if(!($scope.isLoggedIn)){
            $location.path('/login');
        }
        else {
            $scope.juniorid = $routeParams.userid;

            $scope.juniorsheander = ['Name', 'Userid', 'Email', 'Contact'];
            $scope.juniorskeys = ['name', 'userid', 'email', 'contact'];
            $scope.userinfo = {};

            var errorcallback = function (data) {
            };

            var successcallbackdetails = function (data) {
                $scope.userinfo.name = data.data.name;
                $scope.userinfo.username = data.data.username;
                $scope.userinfo.email = data.data.email;
                $scope.userinfo.gender = data.data.gender;
                $scope.userinfo.contact = data.data.contact;
                $scope.userinfo.userid = data.data.userid;
            };
            Auth.getUserDetailsUsingId($routeParams.userid, successcallbackdetails, errorcallback);

            $scope.gotTasks = false;
            $scope.tasksheander = ['Name', 'Description', 'Date'];
            $scope.taskskeys = ['name', 'description', 'date'];
            var successcallbacktasks = function (data) {
                $scope.tasksData = data.tasks;
                if ($scope.tasksData.length > 0) {
                    $scope.gotTasks = true;
                }
            };
            Auth.getTasks($routeParams.userid, successcallbacktasks, errorcallback);


            $scope.gotComments = false;
            $scope.commentsheander = ['Comment','Date','Rating'];
            $scope.commentskeys = ['comment','date','rating'];
            $scope.averageRating = 0;
            var successcallbackcomments = function(data){
                $scope.commentsData = data.comments;
                if($scope.commentsData) {
                    for (var i = 0; i < $scope.commentsData.length; i++) {
                        $scope.averageRating += parseFloat($scope.commentsData[i].rating);
                    }
                    if($scope.commentsData.length > 0){
                        $scope.averageRating = $scope.averageRating / $scope.commentsData.length;
                    }
                    $scope.averageRating = $scope.averageRating.toFixed(2);
                }
                $scope.gotComments = true;
            };

            var errorcallback = function(data){
            };
            Auth.getComments($routeParams.userid,successcallbackcomments,errorcallback);


            $scope.gotJuniors = false;
            $scope.juniorsheander = ['Name', 'Userid', 'Email', 'Contact'];
            $scope.juniorskeys = ['name', 'userid', 'email', 'contact'];
            var successcallbackjuniorsids = function (data) {
                var i;
                var ids = "";
                for (i = 0; i < data.juniors.length; i++) {
                    var id = data.juniors[i];
                    if (i < data.juniors.length - 1) {
                        ids = ids + id + ",";
                    }
                    else {
                        ids = ids + id;
                    }
                }
                if(ids.length > 0) {
                    var successcallbackjuniors = function (data) {
                        $scope.juniorsData = data.data;
                        if ($scope.juniorsData.length > 0) {
                            $scope.gotJuniors = true;
                        }
                        $scope.gotJuniors = true;
                    };
                    Auth.getUserDetailsUsingIds(ids, successcallbackjuniors, errorcallback);
                }
            };
            Auth.getJuniorsId($routeParams.userid, successcallbackjuniorsids, errorcallback);


            $scope.gotSeniors = false;
            $scope.seniorsheander = ['Name', 'Userid', 'Email', 'Contact'];
            $scope.seniorskeys = ['name', 'userid', 'email', 'contact'];
            var successcallbackseniorsids = function (data) {
                var i;
                var ids = "";
                for (i = 0; i < data.seniors.length; i++) {
                    var id = data.seniors[i];
                    if (i < data.seniors.length - 1) {
                        ids = ids + id + ",";
                    }
                    else {
                        ids = ids + id;
                    }
                }
                if(ids.length > 0) {
                    var successcallbackseniors = function (userdata) {
                        $scope.seniorsData = userdata.data;
                        if ($scope.seniorsData.length > 0) {
                            $scope.gotSeniors = true;
                        }
                    };
                    Auth.getUserDetailsUsingIds(ids, successcallbackseniors, errorcallback);
                }
            };
            Auth.getSeniorsId($routeParams.userid, successcallbackseniorsids, errorcallback);

            $scope.submitComment = function (comment, rating) {
                var successcallback = function (data2) {
                    $scope.showNotification(data2.msg, data2.success);
                    if (data2.success == true) {
                        var successcallbackcomments = function (data) {
                            $scope.commentsData = data.comments;
                            if ($scope.commentsData.length > 0) {
                                $scope.gotComments = true;
                            }
                            $scope.comment = "";
                            $scope.rating = "";
                        };
                        Auth.getComments($routeParams.userid, successcallbackcomments, errorcallback);
                    }
                };
                Auth.submitComment(comment, rating, $routeParams.userid, successcallback, errorcallback);
            };
            $scope.rangeForRating = function(rating){
                if(rating <= 0){
                    $scope.rating = "";
                }
                else if(rating > 10){
                    $scope.rating = 10;
                    alert("Rate between 1 to 10 only");
                }
            };
            $scope.cancomment = false;
            var successcallbackisjuniorof = function (data) {
                if (data.success && data.found) {
                    $scope.cancomment = true;
                }
            };
            Auth.isJuniorOf($scope.userdetails.userid, $routeParams.userid, successcallbackisjuniorof, errorcallback);
        }
    })
;
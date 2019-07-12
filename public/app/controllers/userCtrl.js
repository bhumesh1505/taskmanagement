angular.module('userControllers',[])

    .controller('regCtrl', function($scope,$http,$location,$timeout,Auth) {
        if($scope.isLoggedIn && $scope.isAdmin){
            $scope.successMsg = false;
            $scope.errorMsg = false;

            $scope.regUser = function (userData) {
                $scope.successMsg = false;
                $scope.errorMsg = false;
                var successcallbackcreate = function(data){
                    console.log(data);
                    $scope.showNotification(data.msg,data.success);
                    if (data.success) {
                        $scope.successMsg = data.msg;
                    }
                    else {
                        $scope.errorMsg = data.msg;
                    }
                };
                var errorcallback = function(data){
                };
                Auth.registerUser(userData.name, userData.username, userData.email, userData.password, userData.userid, userData.contact, userData.gender, $scope.userdetails.userid,successcallbackcreate,errorcallback);
            }
        } else if($scope.isLoggedIn) {
            $location.path('taskmanager/profile')
        } else {
            $location.path('taskmanager/login')
        }
    })

    .controller('loginCtrl', function($scope,$http,$location,$timeout) {
        if($scope.isLoggedIn){
            $location.path('taskmanager/profile');
        } else {
        }
    })

    .controller('profileCtrl', function($scope,$http,$location,$timeout,Auth) {
        if(!($scope.isLoggedIn)){
            $location.path('taskmanager/login');
        }
        else {

        }
    })

    .controller('tasksCtrl', function($scope,$http,$location,$timeout,Auth) {
        if(!($scope.isLoggedIn)){
            $location.path('taskmanager/login');
        }
        else {
            $scope.gotTasks = false;
            $scope.tasksheander = ['Name', 'Description', 'Date'];
            $scope.taskskeys = ['name', 'description', 'date'];

            var successcallbacktasks = function (data) {
                var arrayofTasks = [];
                var tasksGivenDayObj = {};

                if(data.tasks.length > 0) {
                    var i = 0;
                    var countDays = 0;
                    var d = new Date(data.tasks[i].date);
                    var date = {};
                    date.day = d.getDate();
                    date.month = d.getMonth();
                    date.year = d.getFullYear();

                    tasksGivenDayObj.date = date;
                    tasksGivenDayObj.tasks = [];
                    var iscompleted = false;
                    if (data.tasks[i].iscompleted == undefined) {
                        iscompleted = false;
                    }
                    else if (data.tasks[i].iscompleted == false) {
                        iscompleted = false;
                    }
                    else {
                        iscompleted = true;
                    }
                    tasksGivenDayObj.tasks.push({
                        name: data.tasks[i].name,
                        description: data.tasks[i].description,
                        _id: data.tasks[i]._id,
                        iscompleted: iscompleted
                    });
                    if (countDays % 2 == 1) {
                        tasksGivenDayObj.containerSideClassName = "rightTimeline";
                    } else {
                        tasksGivenDayObj.containerSideClassName = "leftTimeline";
                    }

                    i++;

                    while (i < data.tasks.length) {
                        d = new Date(data.tasks[i].date);
                        date = {};
                        date.day = d.getDate();
                        date.month = d.getMonth();
                        date.year = d.getFullYear();

                        if (data.tasks[i].iscompleted == undefined) {
                            iscompleted = false;
                        }
                        else if (data.tasks[i].iscompleted == false) {
                            iscompleted = false;
                        }
                        else {
                            iscompleted = true;
                        }

                        if (date.day == tasksGivenDayObj.date.day && date.month == tasksGivenDayObj.date.month && date.year == tasksGivenDayObj.date.year) {
                            tasksGivenDayObj.tasks.push({
                                name: data.tasks[i].name,
                                description: data.tasks[i].description,
                                _id: data.tasks[i]._id,
                                iscompleted: iscompleted
                            });
                        } else {
                            countDays++;
                            arrayofTasks.push(tasksGivenDayObj);
                            tasksGivenDayObj = {};
                            tasksGivenDayObj.date = date;
                            tasksGivenDayObj.tasks = [];
                            tasksGivenDayObj.tasks.push({
                                name: data.tasks[i].name,
                                description: data.tasks[i].description,
                                _id: data.tasks[i]._id,
                                iscompleted: iscompleted
                            });
                            if (countDays % 2 == 1) {
                                tasksGivenDayObj.containerSideClassName = "rightTimeline";
                            } else {
                                tasksGivenDayObj.containerSideClassName = "leftTimeline";
                            }
                        }
                        i++;
                    }
                    arrayofTasks.push(tasksGivenDayObj);
                }
                $scope.tasksData = arrayofTasks;
                $scope.gotTasks = true;
            };

            var errorcallback = function (data) {
            };
            Auth.getTasks($scope.userdetails.userid, successcallbacktasks, errorcallback);

            $scope.addTask = function (name, description) {
                var successcallbackaddtask = function (data) {
                    $scope.showNotification(data.msg, data.success);
                    if (data.success) {
                        $scope.taskdescription = "";
                        $scope.taskname = "";
                        Auth.getTasks($scope.userdetails.userid, successcallbacktasks, errorcallback);
                    }
                };
                Auth.addTask(name, description, $scope.userdetails.userid, successcallbackaddtask, errorcallback);
            };
            $scope.istaskcompletedToggle = function(taskid, currentstatus, date){
                var successcallbackistaskcompleted = function(data){
                    if(data.success){
                        $scope.showNotification(data.msg, data.success);
                        Auth.getTasks($scope.userdetails.userid, successcallbacktasks, errorcallback);
                    }
                };
                Auth.istaskcompletedToggle(taskid,currentstatus,date,successcallbackistaskcompleted,errorcallback);
            }
        }
    })

    .controller('commentsCtrl', function($scope,$http,$location,$timeout,Auth) {
        if(!($scope.isLoggedIn)){
            $location.path('taskmanager/login');
        }
        else {
            $scope.gotComments = false;
            $scope.commentsheander = ['Comment', 'Date', 'Rating'];
            $scope.commentskeys = ['comment', 'date', 'rating'];
            $scope.averageRating = 0;


            var successcallbackcomments = function (data) {
                var arrayByMonths = [];
                var commentsGivenMonthObj = {};
                var avgRatingMonthWise = 0;
                var totalCommentsMonthWise = 0;
                var avgRatingOverall = 0;
                var totalComments = 0;

                if(data.comments && data.comments.length > 0){
                    var i = 0;
                    var d = new Date(data.comments[i].date);
                    var date = {};
                    date.day = d.getDate();
                    date.month = d.getMonth();
                    date.year = d.getFullYear();
                    commentsGivenMonthObj.date = date;
                    commentsGivenMonthObj.comments = [];
                    commentsGivenMonthObj.rating = 0;

                    while(i < data.comments.length){ // i starting from 0
                        var d2 = new Date(data.comments[i].date);
                        var date2 = {};
                        date2.day = d2.getDate();
                        date2.month = d2.getMonth();
                        date2.year = d2.getFullYear();
                        if(date2.month == date.month && date2.year == date.year){
                            commentsGivenMonthObj.comments.push({date:date2, comment: data.comments[i].comment, rating: data.comments[i].rating });
                            avgRatingMonthWise += parseFloat(data.comments[i].rating);
                            totalCommentsMonthWise++;
                            avgRatingOverall += parseFloat(data.comments[i].rating);
                            totalComments++;

                            i++;
                        } else {
                            if(totalCommentsMonthWise > 0){
                                commentsGivenMonthObj.rating = avgRatingMonthWise / totalCommentsMonthWise;
                            }
                            commentsGivenMonthObj.rating = commentsGivenMonthObj.rating.toFixed(2);
                            avgRatingMonthWise = 0;
                            totalCommentsMonthWise = 0;
                            arrayByMonths.push(commentsGivenMonthObj);

                            commentsGivenMonthObj = {};
                            d = new Date(data.comments[i].date);
                            date = {};
                            date.day = d.getDate();
                            date.month = d.getMonth();
                            date.year = d.getFullYear();
                            commentsGivenMonthObj.date = date;
                            commentsGivenMonthObj.comments = [];
                            commentsGivenMonthObj.rating = 0;
                        }
                    }
                }
                if(totalCommentsMonthWise > 0){
                    commentsGivenMonthObj.rating = avgRatingMonthWise / totalCommentsMonthWise;
                }
                commentsGivenMonthObj.rating = commentsGivenMonthObj.rating.toFixed(2);
                arrayByMonths.push(commentsGivenMonthObj);

                $scope.commentsData = arrayByMonths;
                if(totalComments > 0){
                    $scope.averageRating = avgRatingOverall / totalComments;
                }
                $scope.averageRating = $scope.averageRating.toFixed(2);
                $scope.gotComments = true;
            };

            var errorcallback = function (data) {
            };
            Auth.getComments($scope.userdetails.userid, successcallbackcomments, errorcallback);
        }

    })

    .controller('juniorsCtrl', function($scope,$http,$location,$timeout,Auth) {

        if(!($scope.isLoggedIn)){
            $location.path('taskmanager/login');
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
                $location.path('taskmanager/junior/' + userid);
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

    .controller('seniorsCtrl', function($scope,$http,$location,$timeout,Auth) {

        if(!($scope.isLoggedIn)){
            $location.path('taskmanager/login');
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
                if(ids.length > 0) {
                    var successcallbackseniors = function (userdata) {
                        $scope.seniorsData = userdata.data;
                        $scope.gotSeniors = true;
                    };
                    Auth.getUserDetailsUsingIds(ids, successcallbackseniors, errorcallback);
                }
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

    .controller('viewJuniorCtrl', function($scope,$http,$location,$timeout,Auth,$routeParams) {

        if(!($scope.isLoggedIn)){
            $location.path('taskmanager/login');
        }
        else {
            $scope.juniorid = $routeParams.userid;

            $scope.juniorsheander = ['Name', 'Userid', 'Email', 'Contact'];
            $scope.juniorskeys = ['name', 'userid', 'email', 'contact'];
            $scope.userinfo = {};
            $scope.tab = {};
            $scope.tab.comments = false;
            $scope.tab.profile = false;
            $scope.tab.juniors = false;
            $scope.tab.seniors = false;
            $scope.tab.tasks = true;

            $scope.showTab = function(key){
                $scope.tab.comments = false;
                $scope.tab.profile = false;
                $scope.tab.juniors = false;
                $scope.tab.seniors = false;
                $scope.tab.tasks = false;
                $scope.tab[key] = true;
            };
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
                var arrayofTasks = [];
                var tasksGivenDayObj = {};
                if(data.tasks.length > 0) {
                    var i = 0;
                    var countDays = 0;
                    var d = new Date(data.tasks[i].date);
                    var date = {};
                    date.day = d.getDate();
                    date.month = d.getMonth();
                    date.year = d.getFullYear();

                    tasksGivenDayObj.date = date;
                    tasksGivenDayObj.tasks = [];
                    var iscompleted = false;
                    if (data.tasks[i].iscompleted == undefined) {
                        iscompleted = false;
                    }
                    else if (data.tasks[i].iscompleted == false) {
                        iscompleted = false;
                    }
                    else {
                        iscompleted = true;
                    }
                    tasksGivenDayObj.tasks.push({
                        name: data.tasks[i].name,
                        description: data.tasks[i].description,
                        _id: data.tasks[i]._id,
                        iscompleted: iscompleted
                    });
                    if (countDays % 2 == 1) {
                        tasksGivenDayObj.containerSideClassName = "rightTimeline";
                    } else {
                        tasksGivenDayObj.containerSideClassName = "leftTimeline";
                    }

                    i++;

                    while (i < data.tasks.length) {
                        d = new Date(data.tasks[i].date);
                        date = {};
                        date.day = d.getDate();
                        date.month = d.getMonth();
                        date.year = d.getFullYear();

                        if (data.tasks[i].iscompleted == undefined) {
                            iscompleted = false;
                        }
                        else if (data.tasks[i].iscompleted == false) {
                            iscompleted = false;
                        }
                        else {
                            iscompleted = true;
                        }

                        if (date.day == tasksGivenDayObj.date.day && date.month == tasksGivenDayObj.date.month && date.year == tasksGivenDayObj.date.year) {
                            tasksGivenDayObj.tasks.push({
                                name: data.tasks[i].name,
                                description: data.tasks[i].description,
                                _id: data.tasks[i]._id,
                                iscompleted: iscompleted
                            });
                        } else {
                            countDays++;
                            arrayofTasks.push(tasksGivenDayObj);
                            tasksGivenDayObj = {};
                            tasksGivenDayObj.date = date;
                            tasksGivenDayObj.tasks = [];
                            tasksGivenDayObj.tasks.push({
                                name: data.tasks[i].name,
                                description: data.tasks[i].description,
                                _id: data.tasks[i]._id,
                                iscompleted: iscompleted
                            });
                            if (countDays % 2 == 1) {
                                tasksGivenDayObj.containerSideClassName = "rightTimeline";
                            } else {
                                tasksGivenDayObj.containerSideClassName = "leftTimeline";
                            }
                        }
                        i++;
                    }
                    arrayofTasks.push(tasksGivenDayObj);
                }
                $scope.tasksData = arrayofTasks;
                $scope.gotTasks = true;
            };

            Auth.getTasks($routeParams.userid, successcallbacktasks, errorcallback);

            $scope.addTask = function (name, description) {
                var successcallbackaddtask = function (data) {
                    $scope.showNotification(data.msg, data.success);
                    if (data.success) {
                        $scope.taskdescription = "";
                        $scope.taskname = "";
                        Auth.getTasks($routeParams.userid, successcallbacktasks, errorcallback);
                    }
                };
                Auth.addTask(name, description, $scope.userinfo.userid, successcallbackaddtask, errorcallback);
            };

            $scope.gotComments = false;
            $scope.commentsheander = ['Comment','Date','Rating'];
            $scope.commentskeys = ['comment','date','rating'];
            $scope.averageRating = 0;
            /*var successcallbackcomments = function(data){
                $scope.commentsData = data.comments;
                if($scope.commentsData) {
                    for (var i = 0; i < $scope.commentsData.length; i++) {
                        $scope.averageRating += parseFloat($scope.commentsData[i].rating);
                    }
                    if($scope.commentsData.length > 0){
                        $scope.averageRating = $scope.averageRating / $scope.commentsData.length;
                    }
                    $scope.averageRating = $scope.averageRating.toFixed(2);
                    if($scope.commentsData.length > 0){
                        $scope.gotComments = true;
                    }
                    else {
                        $scope.gotComments = false;
                    }
                }
            };
            */
            var successcallbackcomments = function (data) {
                var arrayByMonths = [];
                var commentsGivenMonthObj = {};
                var avgRatingMonthWise = 0;
                var totalCommentsMonthWise = 0;
                var avgRatingOverall = 0;
                var totalComments = 0;

                if(data.comments && data.comments.length > 0){
                    var i = 0;
                    var d = new Date(data.comments[i].date);
                    var date = {};
                    date.day = d.getDate();
                    date.month = d.getMonth();
                    date.year = d.getFullYear();
                    commentsGivenMonthObj.date = date;
                    commentsGivenMonthObj.comments = [];
                    commentsGivenMonthObj.rating = 0;

                    while(i < data.comments.length){ // i starting from 0
                        var d2 = new Date(data.comments[i].date);
                        var date2 = {};
                        date2.day = d2.getDate();
                        date2.month = d2.getMonth();
                        date2.year = d2.getFullYear();
                        if(date2.month == date.month && date2.year == date.year){
                            commentsGivenMonthObj.comments.push({date:date2, comment: data.comments[i].comment, rating: data.comments[i].rating });
                            avgRatingMonthWise += parseFloat(data.comments[i].rating);
                            totalCommentsMonthWise++;
                            avgRatingOverall += parseFloat(data.comments[i].rating);
                            totalComments++;

                            i++;
                        } else {
                            if(totalCommentsMonthWise > 0){
                                commentsGivenMonthObj.rating = avgRatingMonthWise / totalCommentsMonthWise;
                            }
                            commentsGivenMonthObj.rating = commentsGivenMonthObj.rating.toFixed(2);
                            avgRatingMonthWise = 0;
                            totalCommentsMonthWise = 0;
                            arrayByMonths.push(commentsGivenMonthObj);

                            commentsGivenMonthObj = {};
                            d = new Date(data.comments[i].date);
                            date = {};
                            date.day = d.getDate();
                            date.month = d.getMonth();
                            date.year = d.getFullYear();
                            commentsGivenMonthObj.date = date;
                            commentsGivenMonthObj.comments = [];
                            commentsGivenMonthObj.rating = 0;
                        }
                    }
                }
                if(totalCommentsMonthWise > 0){
                    commentsGivenMonthObj.rating = avgRatingMonthWise / totalCommentsMonthWise;
                }
                commentsGivenMonthObj.rating = commentsGivenMonthObj.rating.toFixed(2);
                arrayByMonths.push(commentsGivenMonthObj);

                $scope.commentsData = arrayByMonths;
                if(totalComments > 0){
                    $scope.averageRating = avgRatingOverall / totalComments;
                }
                $scope.averageRating = $scope.averageRating.toFixed(2);
                $scope.gotComments = true;
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
            $scope.isjunior = false;
            var successcallbackisjuniorof = function (data) {
                if (data.success && data.found) {
                    $scope.isjunior = true;
                }
            };
            Auth.isJuniorOf($scope.userdetails.userid, $routeParams.userid, successcallbackisjuniorof, errorcallback);
        }
    })
;
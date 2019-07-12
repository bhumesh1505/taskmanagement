angular.module('adminController',[])

.controller('hierarchyCtrl', function($scope,Auth,$timeout){
    var errorcallback = function(data){
    };
    var dataIndex = {};
    var dataArray = "";

    var successcallbackallusers = function(data){
        dataArray = data.data;
        dataIndex = {};

        for(var i=0;i<data.data.length;i++){
            dataIndex[ data.data[i].userid ] = i;
        }

        for(var i=0;i<data.data.length;i++){
            if(data.data[i].seniors.length == 0){
                $scope.drawChart(data.data[i].userid,'',dataIndex[data.data[i].userid],null);
            }
            for(var j=0;j<data.data[i].juniors.length;j++){
                $scope.drawChart(data.data[i].juniors[j],data.data[i].userid, dataIndex[data.data[i].juniors[j]],dataIndex[data.data[i].userid]);
            }
        }
    };
    google.charts.setOnLoadCallback(loadChart);
    var data = "";
    var chart = "";
    function loadChart(){
        data = new google.visualization.DataTable();
        chart = new google.visualization.OrgChart(document.getElementById('chart_div'));
        data.addColumn('string', 'Name');
        data.addColumn('string', 'Manager');
        Auth.getAllUsers(successcallbackallusers,errorcallback);
    }
    $scope.drawChart = function(chieldId,parentId,chieldInfoIndex,parentInfoIndex){
        var chieldName = 'c' ;
        var parentName = 'p' ;
        if(chieldInfoIndex != null){
            chieldName = dataArray[chieldInfoIndex].name;
        }
        if(parentInfoIndex != null){
            parentName = dataArray[parentInfoIndex].name;
        }
        var chieldCode = chieldId + '<div style="font-size:15px;font-weight: 900;">'+ chieldName + '</div>';
        var parentCode = parentId + '<div style="font-size:15px;font-weight: 900;">'+ parentName + '</div>';

        data.addRows([[{v:chieldId, f: chieldCode},
            {v:parentId, f:parentCode}]]);
        chart.draw(data, {allowHtml:true});
    };
    $scope.addJuniorSenior = function(juniorID,seniorID){
        var successcallbackmapping = function(data){
            if(data.success){
                $scope.parentId = "";
                $scope.chieldId = "";
                loadChart();
            }
            $scope.showNotification(data.msg,data.success);
        };
        Auth.mappingJuniorSenior(juniorID,seniorID,$scope.userdetails.userid,successcallbackmapping,errorcallback);
    };
    $scope.removeJuniorSenior = function(juniorID,seniorID){
        var successcallbackmappingremove = function(data){
            if(data.success){
                $scope.parentId = "";
                $scope.chieldId = "";
                loadChart();
            }
            $scope.showNotification(data.msg,data.success);
        };
        Auth.removeMappingJuniorSenior(juniorID,seniorID,$scope.userdetails.userid,successcallbackmappingremove,errorcallback);
    };
})

.controller('employeesCtrl', function($scope,Auth,$location){
    if($scope.isAdmin && $scope.isLoggedIn){

        var errorcallback = function(){

        };

        $scope.gotJuniors = false;
        $scope.juniorsheander = ['Name', 'Userid', 'Email', 'Contact'];
        $scope.juniorskeys = ['name', 'userid', 'email', 'contact' ];

        var successcallbackallusers = function(data){
            $scope.juniorsData = data.data;
            $scope.gotJuniors = true;
        };
        Auth.getAllUsers(successcallbackallusers,errorcallback);

        $scope.toggleActive = function(currentstatus,userid){
            var successcallbackisactive = function(data){
                $scope.showNotification(data.msg,data.success);
                if(data.success){
                    Auth.getAllUsers(successcallbackallusers,errorcallback);
                }
            };
            Auth.isActiveToggle($scope.userdetails.userid, userid, currentstatus,successcallbackisactive,errorcallback);
        }

    } else if($scope.isLoggedIn) {
        $location.path('taskmanager/profile')
    } else {
        $location.path('taskmanager/login')
    }
})

.controller('departmentCtrl', function($scope,Auth,$location){
    if($scope.isAdmin && $scope.isLoggedIn){

        var errorcallback = function(data){

        };
        $scope.gotDepartments = false;
        var successcallbackdepartments = function(data){
            $scope.departmentsData = data.departments;
        };
        Auth.getAllDepartments($scope.userdetails.userid, successcallbackdepartments, errorcallback);
        $scope.showElement = {};
        $scope.toggleElement = function(id){
            $scope.showElement[id] = !$scope.showElement[id];
        };
        $scope.toggleAddDepartmentInput = function(){
            $scope.showAddDepartment = !$scope.showAddDepartment;
        };
        $scope.createActivity = function(departmentname,groupname,subgroupname,activityname){
            var successcallbackcreateActivity = function(data){
                $scope.showNotification(data.msg, data.success);
                if(data.success){
                    $scope.departmentname = "";
                    $scope.groupname = "";
                    $scope.subgroupname = "";
                    $scope.activityname = "";
                    Auth.getAllDepartments($scope.userdetails.userid, successcallbackdepartments, errorcallback);
                }
            };
            Auth.createActivity(departmentname,groupname,subgroupname,activityname,$scope.userdetails.userid, successcallbackcreateActivity,errorcallback);
        }
    } else {
        $location.path('taskmanager/login')
    }
})
;

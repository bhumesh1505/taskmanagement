angular.module('authServices',[])
.factory('Auth',function($http,AuthToken){
    var userFactory = {};

    //Auth.registerUser(---)
    userFactory.registerUser = function(name, username, email, password, userid, contact, gender, adminid ,successcallback,errorcallback){
        var data = {
            name:name,
            username:username,
            email:email,
            password:password,
            userid:userid,
            contact:contact,
            gender:gender,
            adminid:adminid
        };
        return $http({
            url: '/taskmanager/api/register',
            method: "POST",
            data:data
        }).success(function(data){
            successcallback(data);
        }).error(function(data) {
            errorcallback(data);
        });
    };

    //Auth.login(userData)
    userFactory.login = function(data,successcallback,errorcallback){
        return $http({
            url: '/taskmanager/api/login',
            method: "POST",
            data:data
        }).success(function(data){
            AuthToken.setToken(data.token);
            successcallback(data);
        }).error(function(data) {
            errorcallback(data);
        });
    };

    //Auth.isLoggedIn()
    userFactory.isLoggedIn = function(){
        if(AuthToken.getToken()){
            return true;
        } else {
            return false;
        }
    };

    //Auth.logout()
    userFactory.logout = function(){
        AuthToken.removeToken();
    };

    //Auth.getUserDetailsUsingIds()
    userFactory.getUserDetailsUsingIds = function(userid,successcallback,errorcallback){
        var data = {
            userid:userid
        };
        return $http({
            url: '/taskmanager/api/users',
            method: "GET",
            params:data
        }).success(function(data){
            successcallback(data);
        }).error(function(data) {
            errorcallback(data);
        });
    };

    //Auth.getAllUsers()
    userFactory.getAllUsers = function(successcallback,errorcallback){
        return $http({
            url: '/taskmanager/api/allusers',
            method: "GET"
        }).success(function(data){
            successcallback(data);
        }).error(function(data) {
            errorcallback(data);
        });
    };

    //Auth.getUserDetailsUsingId()
    userFactory.getUserDetailsUsingId = function(userid,successcallback,errorcallback){

        var data = {
            userid:userid
        };
        return $http({
            url: '/taskmanager/api/user',
            method: "GET",
            params:data
        }).success(function(data){
            successcallback(data);
        }).error(function(data) {
            errorcallback(data);
        });
    };

    //Auth.getUserFromToken()
    userFactory.getUserFromToken = function(successcallback,errorcallback){
            return $http({
                url: '/taskmanager/api/me',
                method: "POST"
            }).success(function(data){
                successcallback(data);
            }).error(function(data) {
                errorcallback(data);
            });
        };

    //Auth.getTasks()
    userFactory.getTasks = function(userid,successcallback,errorcallback){
        var data = {
            userid : userid
        };
        return $http({
            url: '/taskmanager/api/tasks',
            method: "GET",
            params:data
        }).success(function(data){
            successcallback(data);
        }).error(function(data) {
            errorcallback(data);
        });
    };

    //Auth.getJuniorsId()
    userFactory.getJuniorsId = function(userid,successcallback,errorcallback){
        var data = {
            userid : userid
        };
        return $http({
            url: '/taskmanager/api/juniorsid',
            method: "GET",
            params:data
        }).success(function(data){
            successcallback(data);
        }).error(function(data) {
            errorcallback(data);
        });
    };

    //Auth.getSeniorsId()
    userFactory.getSeniorsId = function(userid,successcallback,errorcallback){
        var data = {
            userid : userid
        };
        return $http({
            url: '/taskmanager/api/seniorsid',
            method: "GET",
            params:data
        }).success(function(data){
            successcallback(data);
        }).error(function(data) {
            errorcallback(data);
        });
    };

    userFactory.getComments = function(userid,successcallback,errorcallback){
        var data = {
            userid : userid
        };
        return $http({
            url: '/taskmanager/api/comments',
            method: "GET",
            params:data
        }).success(function(data){
            successcallback(data);
        }).error(function(data) {
            errorcallback(data);
        });
    };

    userFactory.submitComment = function(comment,rating,userid,successcallback,errorcallback){
        var data = {
            comment:comment,
            rating:rating,
            userid : userid
        };
        return $http({
            url: '/taskmanager/api/comment',
            method: "POST",
            data:data
        }).success(function(data){
            successcallback(data);
        }).error(function(data) {
            errorcallback(data);
        });
    };

    userFactory.addTask = function(taskname,description,userid,successcallback,errorcallback){
        var data = {
            name:taskname,
            description:description,
            userid : userid
        };
        return $http({
            url: '/taskmanager/api/task',
            method: "POST",
            data:data
        }).success(function(data){
            successcallback(data);
        }).error(function(data) {
            errorcallback(data);
        });
    };

    userFactory.isJuniorOf = function(userid,juniorid,successcallback,errorcallback){
        var data = {
            juniorid:juniorid,
            userid : userid
        };
        return $http({
            url: '/taskmanager/api/isjuniorof',
            method: "GET",
            params:data
        }).success(function(data){
            successcallback(data);
        }).error(function(data) {
            errorcallback(data);
        });
    };

    userFactory.mappingJuniorSenior = function(juniorid,seniorid,userid,successcallback,errorcallback){
        var data = {
            juniorid:juniorid,
            seniorid:seniorid,
            adminid:userid
        };
        return $http({
            url: '/taskmanager/api/mapping',
            method: "POST",
            data:data
        }).success(function(data){
            successcallback(data);
        }).error(function(data) {
            errorcallback(data);
        });
    };

    userFactory.removeMappingJuniorSenior = function(juniorid,seniorid,userid,successcallback,errorcallback){
        var data = {
            juniorid:juniorid,
            seniorid:seniorid,
            adminid:userid
        };
        return $http({
            url: '/taskmanager/api/removemapping',
            method: "POST",
            data:data
        }).success(function(data){
            successcallback(data);
        }).error(function(data) {
            errorcallback(data);
        });
    };

    userFactory.isActiveToggle = function(adminid, userid, currentStatus, successcallback, errorcallback ){
        var data = {
            adminid: adminid,
            userid:userid,
            status: !currentStatus  // toggle status
        };
        return $http({
            url: '/taskmanager/api/isemployeeactive',
            method: "POST",
            data:data
        }).success(function(data){
            successcallback(data);
        }).error(function(data) {
            errorcallback(data);
        });
    };

    userFactory.istaskcompletedToggle = function(taskid, currentStatus, date, successcallback, errorcallback ){
        var data = {
            taskid: taskid,
            status: !currentStatus,  // toggle status
            date:date       // object od day, month, year
        };
        return $http({
            url: '/taskmanager/api/istaskcompleted',
            method: "POST",
            data:data
        }).success(function(data){
            successcallback(data);
        }).error(function(data) {
            errorcallback(data);
        });
    };

    userFactory.createDepartment = function(adminid, departmentname, successcallback, errorcallback ){
        var data = {
            adminid:adminid,
            departmentname:departmentname
        };
        return $http({
            url: '/taskmanager/api/department',
            method: "POST",
            data:data
        }).success(function(data){
            successcallback(data);
        }).error(function(data) {
            errorcallback(data);
        });
    };

    userFactory.createGroup = function(adminid, groupname, department, successcallback, errorcallback ){
        var data = {
            adminid:adminid,
            department:department,
            groupname:groupname
        };
        return $http({
            url: '/taskmanager/api/group',
            method: "POST",
            data:data
        }).success(function(data){
            successcallback(data);
        }).error(function(data) {
            errorcallback(data);
        });
    };

    userFactory.createSubgroup = function(adminid, subgroupname, group, successcallback, errorcallback ){
        var data = {
            adminid:adminid,
            group:group,
            subgroupname:subgroupname
        };
        return $http({
            url: '/taskmanager/api/subgroup',
            method: "POST",
            data:data
        }).success(function(data){
            successcallback(data);
        }).error(function(data) {
            errorcallback(data);
        });
    };

    userFactory.getDepartments = function(adminid, successcallback, errorcallback ){
        var data = {
            adminid:adminid
        };
        return $http({
            url: '/taskmanager/api/departments',
            method: "GET",
            params:data
        }).success(function(data){
            successcallback(data);
        }).error(function(data) {
            errorcallback(data);
        });
    };

    userFactory.getGroups = function(adminid, department, successcallback, errorcallback ){
        var data = {
            adminid:adminid,
            department:department
        };
        return $http({
            url: '/taskmanager/api/groups',
            method: "GET",
            params:data
        }).success(function(data){
            successcallback(data);
        }).error(function(data) {
            errorcallback(data);
        });
    };

    userFactory.getSubgroups = function(adminid,group, successcallback, errorcallback ){
        var data = {
            adminid:adminid,
            group:group
        };
        return $http({
            url: '/taskmanager/api/subgroups',
            method: "GET",
            params:data
        }).success(function(data){
            successcallback(data);
        }).error(function(data) {
            errorcallback(data);
        });
    };

    userFactory.getAllDepartments = function(adminid , successcallback, errorcallback ){
        var data = {
            adminid:adminid
        };
        return $http({
            url: '/taskmanager/api/getdepartments',
            method: "GET",
            params:data
        }).success(function(data){
            successcallback(data);
        }).error(function(data) {
            errorcallback(data);
        });
    };

    userFactory.createActivity = function(departmentname, groupname, subgroupname, activityname, adminid, successcallback, errorcallback ){
        var data = {
            adminid:adminid,
            groupname:groupname,
            subgroupname:subgroupname,
            departmentname:departmentname,
            activityname:activityname
        };
        return $http({
            url: '/taskmanager/api/addactivity',
            method: "POST",
            data:data
        }).success(function(data){
            successcallback(data);
        }).error(function(data) {
            errorcallback(data);
        });
    };

    return userFactory;
})

.factory('AuthToken',function($window){
    var authTokenFactory = {};

    //AuthToken.setToken(token)
    authTokenFactory.setToken = function(token){
        $window.localStorage.setItem('token',token);
    };

    //AuthToken.getToken()
    authTokenFactory.getToken = function(){
        return $window.localStorage.getItem('token');
    };

    //AuthToken.removeToken()
    authTokenFactory.removeToken = function(){
        $window.localStorage.removeItem('token');
    };

    return authTokenFactory;
})

.factory('AuthInterceptors',function(AuthToken){
    var authInterceptorsFactory = {};
    authInterceptorsFactory.request = function(config){
        var token = AuthToken.getToken();
        if(token) config.headers['x-access-token'] = token;
        return config;
    }
    return authInterceptorsFactory;
})

;
angular.module('authServices',[])
.factory('Auth',function($http,AuthToken){
    var userFactory = {};

    //Auth.login(userData)
    userFactory.login = function(username,password,successcallback,errorcallback){
        var data = {
            username:username,
            password:password
        };
        return $http({
            url: '/api/login',
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
            url: '/api/users',
            method: "GET",
            params:data
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
            url: '/api/user',
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
                url: '/api/me',
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
            url: '/api/tasks',
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
            url: '/api/juniorsid',
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
            url: '/api/seniorsid',
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
            url: '/api/comments',
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
            url: '/api/comment',
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
            url: '/api/task',
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
            url: '/api/isjuniorof',
            method: "GET",
            params:data
        }).success(function(data){
            successcallback(data);
        }).error(function(data) {
            errorcallback(data);
        });
    };

    userFactory.mappingJuniorSenior = function(juniorid,seniorid,successcallback,errorcallback){
        var data = {
            juniorid:juniorid,
            seniorid:seniorid
        };
        return $http({
            url: '/api/mapping',
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
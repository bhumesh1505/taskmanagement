angular.module('authServices',[])
.factory('Auth',function($http,AuthToken){
    var userFactory = {};

    //Auth.login(userData)
    userFactory.login = function(userData){
        return $http.post('/api/login',userData).then(function(data){
            AuthToken.setToken(data.data.token);
            return data;
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

    /*
    //Auth.getUserFromToken()
    userFactory.getUserFromToken = function(){
        var data = {};
        data.token = AuthToken.getToken();
        return $http.post('/api/me',data).then(function(data){
            return data;
        });
    };
    */

    //Auth.getUserFromToken()
    userFactory.getUserFromToken = function(){
        return $http.post('/api/me').then(function(data){
            return data;
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
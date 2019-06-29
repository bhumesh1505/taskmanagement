angular.module('userServices',[])
.factory('User',function($http){
    var userFactory = {};
    userFactory.create = function(userData){
        return $http.post('/api/register',userData);
    };
    return userFactory;
});
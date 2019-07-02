angular.module('mainController',[])
.controller('mainCtrl',function($scope,Auth,$location,$timeout,$rootScope){

        $scope.userdetails = {};
        $scope.isLoggedIn = false;
        $scope.pageLoaded = false;

        var errorcallback = function(data){
        };
        // every time when route changes it will execute this function
        $rootScope.$on('$routeChangeStart', function(){

            $scope.successMsg = false;
            $scope.errorMsg = false;

            if(Auth.isLoggedIn()){
                $scope.isLoggedIn = true;
                $scope.pageLoaded = true;
                var successcallback = function(data){
                    $scope.userdetails.username = data.username;
                    $scope.userdetails.userid = data.userid;
                    $scope.userdetails.email = data.email;
                    $scope.userdetails.name = data.name;
                    $scope.userdetails.gender = data.gender;
                    $scope.userdetails.contact = data.contact;

                    $scope.isLoggedIn = true;
                    $scope.pageLoaded = true;
                    fadeout();
                };
                Auth.getUserFromToken(successcallback,errorcallback);
            }
            else {
                fadeout();
            }
        });

        $scope.loginUser = function(data){
            $scope.successMsg = false;
            $scope.errorMsg = false;
            var successcallback = function(data){
                $scope.successMsg = data.msg;
                if(data.success){
                    $timeout(function(){
                        $location.path('/profile');
                    },500);
                }
            };
            Auth.login(data.username,data.password,successcallback,errorcallback);

        };

        $scope.logout = function(){
            Auth.logout();
            $scope.isLoggedIn = false;
            $location.path('/logout');
            $timeout(function(){
                $location.path('/login');
            },500);

        };
});
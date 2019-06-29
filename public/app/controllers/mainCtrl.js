angular.module('mainController',[])
.controller('mainCtrl',function($scope,Auth,$location,$timeout,$rootScope){

        $scope.userdetails = {};
        $scope.isLoggedIn = false;
        $scope.pageLoaded = false;

        // every time when route changes it will execute this function
        $rootScope.$on('$routeChangeStart', function(){

            $scope.successMsg = false;
            $scope.errorMsg = false;

            if(Auth.isLoggedIn()){
                Auth.getUserFromToken().then(function(data){
                    $scope.userdetails.username = data.data.username;
                    $scope.userdetails.email = data.data.email;
                    $scope.isLoggedIn = true;
                    $scope.pageLoaded = true;
                    fadeout();
                });
            }
            else {
                $scope.userdetails = {};
                $scope.isLoggedIn = false;
                $scope.pageLoaded = true;
                fadeout();
            }
        });

        $scope.loginUser = function(data){
            $scope.successMsg = false;
            $scope.errorMsg = false;
            Auth.login(data).then(function(data){
                if(data.data.success)
                {
                    $scope.successMsg = data.data.msg;
                    $timeout(function(){
                        $location.path('/profile');
                    },1000);
                }
                else
                {
                    $scope.errorMsg = data.data.msg;
                }
            })
        };

        $scope.logout = function(){
            Auth.logout();
            $location.path('/logout');
            $timeout(function(){
                $location.path('/login');
            },1000);

        };
});
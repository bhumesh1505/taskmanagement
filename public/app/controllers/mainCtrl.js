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

            if(Auth.isLoggedIn()){ // if token is set doesn't mean that it is a valid token which contains user details encrypted inside
                $scope.isLoggedIn = true;
                $scope.pageLoaded = true;
                var successcallback = function(data){
                    if(data.success) { // token is set and it is valid
                        $scope.userdetails.username = data.data.username;
                        $scope.userdetails.userid = data.data.userid;
                        $scope.userdetails.email = data.data.email;
                        $scope.userdetails.name = data.data.name;
                        $scope.userdetails.gender = data.data.gender;
                        $scope.userdetails.contact = data.data.contact;
                        $scope.isLoggedIn = true;
                        fadeout();
                    }
                    else {  // token is set but it is invalid
                        $scope.userdetails.username = "";
                        $scope.userdetails.userid = "";
                        $scope.userdetails.email = "";
                        $scope.userdetails.name = "";
                        $scope.userdetails.gender = "";
                        $scope.userdetails.contact = "";
                        $scope.isLoggedIn = false;
                        $location.path('/login');
                    }
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
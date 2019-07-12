angular.module('mainController',[])
.controller('mainCtrl',function($scope,Auth,$location,$timeout,$rootScope,AuthToken){

        $scope.userdetails = {};
        $scope.isLoggedIn = false;
        $scope.isAdmin = false;
        $scope.pageLoaded = false;
        $scope.notificationSuccessMsg = false;
        $scope.notificationFailedMsg = false;
        $scope.notificationMsg = "Notification MSG";

        /* loading google charts for hierarchical display */
        google.charts.load('current', {packages:["orgchart"]});
        /* end hierarchical display */

        $scope.month = ["January", "February", "March", "April", "May", "June", "July", "August", "September" , "October", "November", "December" ];
        $scope.showNotification = function(msg,success){
            $scope.notificationMsg = msg;
            if(success){
                $scope.notificationSuccessMsg = true;
                $scope.notificationFailedMsg = false;
            } else {
                $scope.notificationSuccessMsg = false;
                $scope.notificationFailedMsg = true;
            }
            $timeout(function(){
                $scope.notificationSuccessMsg = false;
                $scope.notificationFailedMsg = false;
            },2000);
        };

        var errorcallback = function(data){
        };
        // every time when route changes it will execute this function
        $rootScope.$on('$routeChangeStart', function(){

            $scope.successMsg = false;
            $scope.errorMsg = false;

            if(Auth.isLoggedIn()){ // if token is set doesn't mean that it is a valid token which contains user details encrypted inside
                $scope.isLoggedIn = true;
                $scope.pageLoaded = true;

                fadeout();
                var successcallback = function(data){
                    if(data.success) { // token is set and it is valid
                        $scope.userdetails.username = data.data.username;
                        $scope.userdetails.userid = data.data.userid;
                        $scope.userdetails.email = data.data.email;
                        $scope.userdetails.name = data.data.name;
                        $scope.userdetails.gender = data.data.gender;
                        $scope.userdetails.contact = data.data.contact;
                        if(data.data.type == "admin"){
                            $scope.isAdmin = true;
                        }
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
                        AuthToken.removeToken();
                        $location.path('taskmanager/login');
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
            $scope.isAdmin = false;
            var successcallback = function(data){
                $scope.showNotification(data.msg,data.success);
                $scope.successMsg = data.msg;
                if(data.success){
                    $scope.userdetails.username = data.data.username;
                    $scope.userdetails.userid = data.data.userid;
                    $scope.userdetails.email = data.data.email;
                    $scope.userdetails.name = data.data.name;
                    $scope.userdetails.gender = data.data.gender;
                    $scope.userdetails.contact = data.data.contact;
                    $scope.isLoggedIn = true;
                    if(data.data.type == "admin"){
                        $scope.isAdmin = true;
                    } else {
                        $scope.isAdmin = false;
                    }
                    $timeout(function(){
                        $location.path('taskmanager/tasks');
                    },500);
                }
            };
            Auth.login(data,successcallback,errorcallback);
        };

        $scope.logout = function(){
            Auth.logout();
            $scope.showNotification("Successfully Logged Out !",true);
            $scope.isLoggedIn = false;
            $location.path('taskmanager/logout');
            $timeout(function(){
                $location.path('taskmanager/login');
            },500);

        };
});
angular.module('userControllers',[])
.controller('regCtrl', function($scope,$http,$location,$timeout,User) {

        $scope.successMsg = false;
        $scope.errorMsg = false;

        $scope.regUser = function(userData){
            $scope.successMsg = false;
            $scope.errorMsg = false;
            User.create(userData).then(function(data){
                if(data.data.success)
                {
                    $scope.successMsg = data.data.msg;
                    $timeout(function(){
                        $location.path('/login');
                    },1000);
                }
                else
                {
                    $scope.errorMsg = data.data.msg;
                }
            })
        }
});
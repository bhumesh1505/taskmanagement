angular.module('appRoutes',['ngRoute'])
.config(function($routeProvider,$locationProvider){
    $routeProvider

        .when('/home', {
            templateUrl:'app/views/pages/home.html'
        })
        .when('/about', {
            templateUrl:'app/views/pages/about.html'
        })
        .when('/register', {
            templateUrl:'app/views/pages/users/register.html',
            controller:'regCtrl'
        })
        .when('/login', {
            templateUrl:'app/views/pages/users/login.html'
        })
        .when('/logout', {
            templateUrl:'app/views/pages/users/logout.html'
        })
        .when('/profile', {
            templateUrl:'app/views/pages/users/profile.html',
            controller:'profileCtrl'
        })
        .when('/tasks', {
            templateUrl:'app/views/pages/users/tasks.html',
            controller:'tasksCtrl'
        })
        .when('/comments', {
            templateUrl:'app/views/pages/users/comments.html',
            controller:'commentsCtrl'
        })
        .when('/seniors', {
            templateUrl:'app/views/pages/users/seniors.html',
            controller:'seniorsCtrl'
        })
        .when('/juniors', {
            templateUrl:'app/views/pages/users/juniors.html',
            controller:'juniorsCtrl'
        })
        .when('/junior/:userid', {
            templateUrl:'app/views/pages/users/viewjunior.html',
            controller:'viewJuniorCtrl'
        })

        .otherwise({ redirectTo: '/home' });

    // to remove # from url of angular
    $locationProvider.html5Mode({
        enabled:true,
        requireBase: false
    });

});
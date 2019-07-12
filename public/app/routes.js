angular.module('appRoutes',['ngRoute'])
.config(function($routeProvider,$locationProvider){
    $routeProvider

        .when('/taskmanager/home', {
            templateUrl:'/taskmanager/public/app/views/pages/home.html'
        })
        .when('/taskmanager/about', {
            templateUrl:'/taskmanager/public/app/views/pages/about.html'
        })
        .when('/taskmanager/register', {
            templateUrl:'/taskmanager/public/app/views/pages/users/register.html',
            controller:'regCtrl'
        })
        .when('/taskmanager/login', {
            templateUrl:'/taskmanager/public/app/views/pages/users/login.html',
            controller:'loginCtrl'
        })
        .when('/taskmanager/logout', {
            templateUrl:'/taskmanager/public/app/views/pages/users/logout.html'
        })
        .when('/taskmanager/profile', {
            templateUrl:'/taskmanager/public/app/views/pages/users/profile.html',
            controller:'profileCtrl'
        })
        .when('/taskmanager/tasks', {
            templateUrl:'/taskmanager/public/app/views/pages/users/tasks.html',
            controller:'tasksCtrl'
        })
        .when('/taskmanager/comments', {
            templateUrl:'/taskmanager/public/app/views/pages/users/comments.html',
            controller:'commentsCtrl'
        })
        .when('/taskmanager/seniors', {
            templateUrl:'/taskmanager/public/app/views/pages/users/seniors.html',
            controller:'seniorsCtrl'
        })
        .when('/taskmanager/juniors', {
            templateUrl:'/taskmanager/public/app/views/pages/users/juniors.html',
            controller:'juniorsCtrl'
        })
        .when('/taskmanager/junior/:userid', {
            templateUrl:'/taskmanager/public/app/views/pages/users/viewjunior.html',
            controller:'viewJuniorCtrl'
        })
        .when('/taskmanager/junior/profile/:userid', {
            templateUrl:'/taskmanager/public/app/views/pages/users/viewjuniorprofile.html',
            controller:'viewJuniorCtrl'
        })
        .when('/taskmanager/admin', {
            templateUrl:'/taskmanager/public/app/views/pages/admin/assigntasks.html'
        })
        .when('/taskmanager/hierarchy', {
            templateUrl:'/taskmanager/public/app/views/pages/admin/hierarchy.html',
            controller:'hierarchyCtrl'
        })
        .when('/taskmanager/employees', {
            templateUrl:'/taskmanager/public/app/views/pages/admin/employees.html',
            controller:'employeesCtrl'
        })
        .when('/taskmanager/departments', {
            templateUrl:'/taskmanager/public/app/views/pages/admin/departments.html',
            controller:'departmentCtrl'
        })
        .otherwise({ redirectTo: '/taskmanager/login' });

    // to remove # from url of angular
    $locationProvider.html5Mode({
        enabled:true,
        requireBase: false
    });

});
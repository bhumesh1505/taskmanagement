var app = angular.module('userApp',
    [
        'appRoutes',
        'userControllers',
        'ngAnimate',
        'mainController',
        'authServices',
        'adminController'
    ])

    .config(function($httpProvider){
        $httpProvider.interceptors.push('AuthInterceptors');
    });
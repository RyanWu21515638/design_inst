var proside = angular.module('proside', ['ngResource', 'ngCookies']);
proside.controller('prosideCtrl', function ($scope, $timeout, $interval, $location,$state, $cookies, $rootScope, $http , $window) {

    $scope.fromIPM = $cookies.get('fromIPM');
    $scope.winHeight = document.body.clientHeight;
    console.log($scope.winHeight);
})


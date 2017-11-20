

var gantt = angular.module('gantt', ['ngResource', 'ngCookies']);
gantt.controller('ganttCtrl', function ($scope, $http, $filter,$timeout, $interval, $window, $state, $cookies, $location,
                                      $rootScope, projectService) {
    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 1);

    $scope.userinfo = {};               //用户信息

    //获取用户微信id，公司id，设计院权限--可设置成全局变量
    $scope.userinfo.openid = $cookies.get('openid');
    $scope.userinfo.company_id = $cookies.get('company_id');
    $scope.userinfo.headimgurl = $cookies.get('headimgurl');
    $scope.userinfo.company_name = $cookies.get('company_name');
    $scope.userinfo.nickname = $cookies.get('nickname');
    $scope.userinfo.status = $cookies.get('status');

    console.log($scope.prj_chosen);




})



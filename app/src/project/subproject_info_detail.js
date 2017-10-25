var subproject_info_detail = angular.module('subproject_info_detail', ['ngResource', 'ngCookies']);
subproject_info_detail.controller('subproject_info_detailCtrl', function ($scope, $http, $timeout, $interval, $window, $stateParams, $state, $cookies,
                                                  $rootScope, projectService) {
    $scope.prj_id = $stateParams.prj_id;
    $scope.subprj_id = $stateParams.subprj_id;
    console.log($scope.prj_id);
    console.log($scope.subprj_id);

    $scope.subtask_name = "背楞";

    $scope.setRoles = function (index,name) {
        $scope.role_name = name;
    }
    $scope.setSubtask = function (index,name) {
        $scope.subtask_name = name;
    }

    var time = new Date();
    $scope.t1 = {
        year: time.getFullYear(),
        month: time.getMonth() + 1,
        day: time.getDate()
    };
    if ($scope.t1.month < 10)
        $scope.t1.month = "0" + $scope.t1.month;
    //时间选择器1
    $("#timepicker1").datetimepicker({
        language: 'zh-CN',
        format: "yyyy-mm-dd",
        startView: 3,
        minView: 2,
        autoclose: true,
        todayBtn: false,
        pickerPosition: "bottom-left"
    }).on('changeDay', function (ev) {
        $scope.t1.year = ev.date.getFullYear();
        $scope.t1.month = ev.date.getMonth() + 1;
        $scope.t1.day = ev.date.getDate();
        console.log('t1' + JSON.stringify($scope.t1) + 't2' + JSON.stringify($scope.t2));
        if ($scope.project_id) {
            //$scope.changecharts($scope.project_id, $scope.t1.year + '-' + $scope.t1.month +'-' +$scope.t1.day, $scope.t2.year + '-' + $scope.t2.month + '-' + $scope.t2.day);
        }
    }).on("hide", function () {
        $("#timepicker1").blur();
    });
})

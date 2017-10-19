var project = angular.module('project', ['ngResource', 'ngCookies']);
project.controller('projectCtrl', function ($scope, $http, $timeout, $interval, $state, $cookies, $rootScope, projectService) {

    $scope.userinfo = {};
    $scope.prjinfo = {};
    $scope.oldtb = true;
    $scope.userinfo.openid = $cookies.get('openid');
    $scope.userinfo.company_id = $cookies.get('company_id');
    $scope.userinfo.status = $cookies.get('status');
    projectList = function () {
        projectService.project_list($scope.userinfo).then(
            function (res) {
                $scope.prj_list = res.data;
                console.log($scope.prj_list[0].subproject_list);
            }
        )
    };
    userList = function () {
        projectService.user_list($scope.userinfo).then(
            function (res) {
                $scope.usr_list = res.data;
            }
        )
    };
    configurationlist =function(){
        projectService.configuration_list($scope.userinfo).then(
            function (res) {
                $scope.conf_list = res.data;
            }
        )
    };
    grouplist = function () {
        projectService.group_list().then(
            function (res) {
                $scope.grp_list = res.data;
            }
        )
    }
    projectList();
    userList();
    configurationlist();
    grouplist();

    $scope.prj_dt = function (index) {
        $scope.index =index;
        console.log(index);
    }
    $scope.newprj = function () {
        $scope.prjinfo.company_id = $cookies.get('company_id');
        $scope.prjinfo.creator_id = $cookies.get('openid');
        $scope.prjinfo.start_time_plan = $scope.t1.year+'-'+$scope.t1.month+'-'+$scope.t1.day;
        $scope.prjinfo.end_time_plan = $scope.t2.year+'-'+$scope.t2.month+'-'+$scope.t2.day;
        $scope.prjinfo.creator_id = $cookies.get('openid');
        console.log($scope.prjinfo);
        projectService.new_project($scope.prjinfo).then(
            function (res) {
                $scope.grp_list = res.data;
            }
        )

    }

    var time = new Date();
    $scope.t1 = {
        year: time.getFullYear(),
        month: time.getMonth() + 1,
        day:time.getDate()
    };
    $scope.t2 = {
        year: time.getFullYear(),
        month: time.getMonth() + 1,
        day:time.getDate()
    };
    if ($scope.t1.month < 10)
        $scope.t1.month = "0" + $scope.t1.month;
    if ($scope.t2.month < 10)
        $scope.t2.month = "0" + $scope.t2.month;

    //时间选择器1
    $("#timepicker1").datetimepicker({
        language: 'zh-CN',
        format: "yyyy-mm-dd",
        startView: 3,
        minView:2,
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
    //时间选择器2
    $("#timepicker2").datetimepicker({
        language: 'zh-CN',
        format: "yyyy-mm-dd",
        startView: 3,
        minView: 2,
        autoclose: true,
        todayBtn: false,
        pickerPosition: "bottom-left"
    }).on('changeDay', function (ev) {
            $scope.t2.year = ev.date.getFullYear();
            $scope.t2.month = ev.date.getMonth() + 1;
            $scope.t2.day = ev.date.getDate();
            console.log('t1' + JSON.stringify($scope.t1) + 't2' + JSON.stringify($scope.t2));
            if ($scope.project_id) {
                //$scope.changecharts($scope.project_id, $scope.t.year + '-' + $scope.t1.month, $scope.t2.year + '-' + $scope.t2.month);
            }
        }).on("hide", function () {
        $("#timepicker2").blur();
    });
})

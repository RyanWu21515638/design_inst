var subproject_info_detail = angular.module('subproject_info_detail', ['ngResource', 'ngCookies']);
subproject_info_detail.controller('subproject_info_detailCtrl', function ($scope, $http, $timeout, $interval, $window, $stateParams, $state, $cookies,
                                                                          $rootScope, projectService) {
    $scope.prj_id = $stateParams.prj_id;
    $scope.subprj_id = $stateParams.subprj_id;
    console.log($scope.prj_id);
    console.log($scope.subprj_id);
    $scope.task_group_info = {};
    $scope.subtask_info = {};
    $scope.subtask_info.subtask_name = "选择类型";
    $scope.subtask_info.emergency = "普通";
    $scope.subtask_info.urgent = 1;


    $scope.grp_list = JSON.parse($cookies.get('grp_list'));
    //设置总项目角色
    $scope.setRoles = function (index, name) {
        $scope.role_name = name;
        $scope.role_id = index;
    }
    //设置子项目名称
    $scope.setSubtask = function (index, name) {
        $scope.subtask_info.subtask_name = name;
    }
    //设置紧急度
    $scope.setEmergency = function (index, name) {
        $scope.subtask_info.emergency = name;
        $scope.subtask_info.urgent = index;
    }

    //获取项目id为$scope.subprj_id的所有任务
    projectService.taskgroup_task_list($scope.subprj_id).then(
        function (res) {
            $scope.task_list = res.data;
            for(var i = 0;i<$scope.task_list.length;i++)
            {
                $scope.task_list[i]['length'] = $scope.task_list[i].subtask_list.length;
            }
        }
    )
    //新建总项目
    $scope.newTaskGroup = function () {
        console.log($scope.task_group_name);
        $scope.task_group_info.subprj_id = $scope.subprj_id;
        $scope.task_group_info.openid = $cookies.get('openid');
        $scope.task_group_info.role_id = $scope.role_id;
        projectService.add_taskgroup($scope.task_group_info).then(
            function (res) {
                console.log(res.data);
            }
        )
    }
    //新建子项目
    $scope.taskGroupChose =function (id) {
        console.log(id);
        $scope.subtask_info.taskgroup_id = id;
    }
    $scope.newSubTask = function () {
        $scope.subtask_info.creator_id = $cookies.get('openid');
        $scope.subtask_info.changer_id = 'ovMfqvsRZhlwlD3i53Nj26tf8G';
        $scope.subtask_info.parter = ['ovMfqvsRZhlwlD3i53Nj26tf8G'];

        $scope.subtask_info.remarks = '哈哈';
        $scope.subtask_info.end_time_plan = '2017-10-20';
        $scope.subtask_info.urgent = 1;
        projectService.add_task($scope.subtask_info).then(
            function (res) {
                console.log(res.data);
            }
        )
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

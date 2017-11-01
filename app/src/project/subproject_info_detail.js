var subproject_info_detail = angular.module('subproject_info_detail', ['ngResource', 'ngCookies']);
subproject_info_detail.controller('subproject_info_detailCtrl', function ($scope, $http, $timeout, $interval, $window,
                                                                          $stateParams, $state, $cookies, $location,
                                                                          $rootScope, projectService) {

    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 1);


    $scope.prj_id = $stateParams.prj_id;
    $scope.subprj_id = $stateParams.subprj_id;
    console.log($scope.prj_id);
    console.log($scope.subprj_id);
    if ($scope.subprj_id) {
        $rootScope.menu = true;
        //document.getElementById('container1').style.display = 'inline-block';
    }
    else {
        $rootScope.menu = false;
    }
    $scope.task_group_info = {};
    $scope.subtask_info = {};
    $scope.subtask_info.subtask_name = "选择类型";
    $scope.subtask_info.emergency = "普通";
    $scope.subtask_info.urgent = 1;
    $scope.subtask_info.partitionNickname = [];
    $scope.subtask_info.parter = [];

    $scope.userinfo = {};
    $scope.userinfo.openid = $cookies.get('openid');
    $scope.userinfo.company_id = $cookies.get('company_id');
    $scope.userinfo.status = $cookies.get('status');


    $scope.grp_list = JSON.parse($cookies.get('grp_list'));
    projectService.project_list($scope.userinfo).then(
        function (res) {
            $scope.prj_list = res.data;
            //根据prj_id和subprj_id查询项目名称
            for (var j = 0; j < $scope.prj_list.length; j++) {
                if ($scope.prj_list[j].project_id == $scope.prj_id) {
                    $scope.prj_name = $scope.prj_list[j].name;
                    for (var jj = 0; jj < $scope.prj_list[j].subproject_list.length; jj++) {
                        if ($scope.prj_list[j].subproject_list[jj].subproject_id == $scope.subprj_id)
                            $scope.subprj_name = $scope.prj_list[j].subproject_list[jj].name;
                    }
                }
            }
            $http.get($rootScope.ip + '/design_institute/public/home/Projecttrailinfo/getProjecttrailinfos?' +
                'prj_id=' + $scope.prj_id + '&subproject_id=' + $scope.subprj_id).success(
                function (res) {
                    $rootScope.opt_prj_list = res;
                    $rootScope.imglist = new Array();
                    for (var i = 0; i < $scope.opt_prj_list.length; i++) {
                        $rootScope.imglist[i] = $scope.opt_prj_list[i].headimgurl;
                    }
                    $rootScope.imglist[$scope.opt_prj_list.length] = 'app/build/image/all.jpg';
                    $rootScope.imglist = DropRepeat($rootScope.imglist);
                }).error(function () {
                alert("an unexpected error ocurred!");
            })
        }
    )
    projectService.project_role_list($scope.subprj_id).then(
        function (res) {
            $scope.prj_role_list = res.data;
            for(var i = 0;i<$scope.prj_role_list.length;i++)
            {
                if($scope.prj_role_list[i].openid == $cookies.get('openid'))
                {
                    $scope.newtaskAuthor = $scope.prj_role_list[i].roles.var_3;
                    break;
                }
            }
        }
    )

    projectService.month_task_list($scope.subprj_id).then(
        function (res) {
            $rootScope.time_x = [];
            $rootScope.done = [];
            $rootScope.done_sum = 0;
            $rootScope.sum_1 = [];
            $rootScope.sum_1_sum = 0;
            for (var i = 1; i < res.data.length; i++) {
                $rootScope.time_x.push(res.data[i].time);
                $rootScope.done.push(parseInt(res.data[i].sum_1 - res.data[i].sum));
                $rootScope.done_sum = $rootScope.done_sum+parseInt(res.data[i].sum_1 - res.data[i].sum);
                $rootScope.sum_1.push(parseInt(res.data[i].sum_1));
                $rootScope.sum_1_sum = $rootScope.sum_1_sum+parseInt(res.data[i].sum_1);
            }
            prj_keboard();
            //$window.location.reload();
        }
    )
    //任务看板

    prj_keboard = function () {

            $('#container1').ready(function () {
                var chart = {
                    zoomType: 'xy'
                };
                var title = {
                    text: ''
                };
                var xAxis = {
                    categories: $scope.time_x,
                    crosshair: true
                };

                var series = [{
                    name: '已完成',
                    type: 'spline',
                    yAxis: 1,
                    data: $scope.done,
                    tooltip: {
                        valueSuffix: ''
                    }
                }, {
                    name: '未完成',
                    type: 'spline',
                    yAxis: 1,
                    data: $scope.sum_1,
                    tooltip: {
                        valueSuffix: ''
                    },
                },];
                var yAxis = [{ // 第一条Y轴
                    labels: {
                        format: '{value}',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    title: {
                        text: '',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    }
                }, { // 第二条Y轴
                    title: {
                        text: '',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    labels: {
                        format: '{value}',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    opposite: true
                }];
                var tooltip = {
                    shared: true,

                };
                var plotOptions = {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    },
                    series: {
                        cursor: 'pointer',
                        events: {
                            /*click: function (e) {
                                if (type == 1) {
                                    console.log(e.point.category);
                                    $scope.changecharts($scope.project_id, e.point.category.split('-')[0] + '-' + e.point.category.split('-')[1], e.point.category.split('-')[0] + '-' + e.point.category.split('-')[1]);
                                }
                                if (type == 2) {
                                    console.log(e.point.category);
                                    $scope.changecharts($scope.project_id, e.point.category + '-' + '01', e.point.category + '-' + '12');
                                }
                            }*/
                        }
                    }
                };
                var legend = {
                    layout: 'horizontal',//horizontal、vertical
                    align: 'left',
                    x: 580,
                    verticalAlign: 'top',
                    y: 20,
                    floating: true,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#faf8ff'
                };

                var json = {};
                json.chart = chart;
                json.title = title;
                json.xAxis = xAxis;
                json.yAxis = yAxis;
                json.tooltip = tooltip;
                json.legend = legend;
                json.series = series;
                json.plotOptions = plotOptions;
                $('#container1').highcharts(json);
            });

    }


    //设置总任务角色
    $scope.setRoles = function (index, name) {
        $scope.role_name = name;
        $scope.role_id = index;
    }
    //设置子任务名称
    $scope.setSubtask = function (index, name) {
        $scope.subtask_info.subtask_name = name;
    }
    //设置子任务紧急度
    $scope.setEmergency = function (index, name) {
        $scope.subtask_info.emergency = name;
        $scope.subtask_info.urgent = index;
    }
    //设置子任务负责人
    $scope.chargerChose = function (nickname, openid) {
        $scope.subtask_info.chargerNickname = nickname;
        $scope.subtask_info.changer_id = openid;
    }
    //设置子任务参与者
    $scope.partitionChose = function (nickname, openid) {
        var exsit = false;
        var ischarger = false;
        if (openid == $scope.subtask_info.changer_id) {
            alert("已设置为负责人!");
        }
        else {
            for (var i = 0; i < $scope.subtask_info.parter.length; i++) {
                if ($scope.subtask_info.parter[i] == openid) {
                    exsit = true;
                    break
                }
            }
            if (exsit) {
                alert('已经添加过了');
            }
            else {
                $scope.subtask_info.partitionNickname.push(nickname);
                $scope.subtask_info.parter.push(openid);
                exsit = false;
            }
        }
    }


    $scope.removePartition = function (nickname) {
        var indexof = -1;
        for (var i = 0; i < $scope.subtask_info.partitionNickname.length; i++) {
            if ($scope.subtask_info.partitionNickname[i] == nickname) {
                var indexof = i;
            }
        }
        if (indexof > -1) {
            $scope.subtask_info.partitionNickname.splice(indexof, 1);
            $scope.subtask_info.parter.splice(indexof, 1);
        }
    }
    //获取项目id为$scope.subprj_id的所有任务
    taskgroupTaskList =function () {
        projectService.taskgroup_task_list($scope.subprj_id).then(
            function (res) {
                $scope.task_list = res.data;
                for (var i = 0; i < $scope.task_list.length; i++) {
                    $scope.task_list[i]['length'] = $scope.task_list[i].subtask_list.length;
                }
            }
        )
    }
    taskgroupTaskList();

    //新建总任务
    $scope.newTaskGroup = function () {
        console.log($scope.task_group_name);
        $scope.task_group_info.subprj_id = $scope.subprj_id;
        $scope.task_group_info.openid = $cookies.get('openid');
        $scope.task_group_info.role_id = $scope.role_id;
        projectService.add_taskgroup($scope.task_group_info).then(
            function (res) {
                console.log(res.data);
                taskgroupTaskList();
            }
        )
    }
    //删除总任务
    $scope.delTaskgroup =function (taskgoup_id) {
        //console.log(taskgoup_id);
        projectService.del_taskgroup(taskgoup_id).then(
            function (res) {
                console.log(res.data);
                taskgroupTaskList();
            }
        )
    }
    //选中总任务
    $scope.taskGroupChose = function (id, index) {
        $scope.tasktype = 'father';

        console.log($scope.tasktype);
        $scope.taskgoup_name = $scope.task_list[index].name;
        $scope.taskgoup_id = $scope.task_list[index].id;
        console.log($scope.taskgoup_name);
        $scope.subtask_info.taskgroup_id = id;
    }
    //新建子任务
    $scope.newSubTask = function () {
        $scope.subtask_info.creator_id = $cookies.get('openid');
        $scope.subtask_info.end_time_plan = $scope.t1.year + '-' + $scope.t1.month + '-' + $scope.t1.day;
        ;

        console.log($scope.subtask_info);
        projectService.add_task($scope.subtask_info).then(
            function (res) {
                console.log(res.data);
                taskgroupTaskList();
            }
        )
    }
    //保存子任务修改
    $scope.saveSubTask = function () {

    }
    //删除子任务
    $scope.delTask = function (task_id) {
        projectService.del_task(task_id).then(
            function (res) {
                console.log(res.data);
                taskgroupTaskList();
            }
        )
    }
    //选中子任务
    $scope.subTaskChose = function (taskIndex, subTaskIndex) {
        $scope.tasktype = 'son';
        console.log($scope.tasktype);
        $scope.taskIndex = taskIndex;
        $scope.subTaskIndex = subTaskIndex;
        $scope.subtask_info.subtask_name = $scope.task_list[taskIndex].subtask_list[subTaskIndex].name;
        $scope.subtask_info.chargerNickname = $scope.task_list[taskIndex].subtask_list[subTaskIndex].changer_nickname;
        $scope.subtask_info.changer_id = $scope.task_list[taskIndex].subtask_list[subTaskIndex].changer_id;
        $scope.subtask_info.urgent = $scope.task_list[taskIndex].subtask_list[subTaskIndex].urgent;
        $scope.subtask_info.remarks = $scope.task_list[taskIndex].subtask_list[subTaskIndex].remarks;
        $scope.subtask_info.id = $scope.task_list[taskIndex].subtask_list[subTaskIndex].id;

        var remindTime = $scope.task_list[taskIndex].subtask_list[subTaskIndex].end_time_plan;
        var str = remindTime.toString();
        str = str.replace("/-/g", "/");
        var t1_temp = new Date(str);
        $scope.t1.year = t1_temp.getFullYear();
        $scope.t1.month = t1_temp.getMonth() + 1;
        $scope.t1.day = t1_temp.getDate();
        //$scope.task_list[taskIndex].subtask_list[subTaskIndex];
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
    //


    console.log($rootScope.menu);
    /*$scope.showMenu = function () {
        $rootScope.menu = !$rootScope.menu;
        if ($rootScope.menu)
        {
            document.getElementById('container1').style.display = 'inline-block';
            $rootScope.menu = true;
        }

        else
            $rootScope.menu = false;
    }*/
    //数组去冗余
    DropRepeat = function (arr) {
        // 遍历arr，把元素分别放入tmp数组(不存在才放)
        var tmp = new Array();
        for (var i = 0; i < arr.length; i++) {
            //该元素在tmp内部不存在才允许追加
            if (tmp.indexOf(arr[i]) == -1) {
                tmp.push(arr[i]);
            }
        }
        return tmp;
    }
    $scope.bindquery = function (x) {
        if(x == 'app/build/image/all.jpg')
            $scope.query = '';
        else
        $scope.query = x;
    }
    $(".popover-options a").popover({html : true });
});

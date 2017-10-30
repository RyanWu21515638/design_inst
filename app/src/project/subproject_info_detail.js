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
    $scope.subtask_info.partitionNickname = [];
    $scope.subtask_info.parter = [];

    $scope.userinfo = {};
    $scope.userinfo.openid = $cookies.get('openid');
    $scope.userinfo.company_id = $cookies.get('company_id');
    $scope.userinfo.status = $cookies.get('status');


    $scope.grp_list = JSON.parse($cookies.get('grp_list'));
    $scope.prj_role_list = JSON.parse($cookies.get('prj_role_list'));
    console.log($scope.prj_role_list);
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


            $http.get('http://192.168.3.168/design_institute/public/home/Projecttrailinfo/getProjecttrailinfos?' +
                'prj_id=' + $scope.prj_id + '&subproject_id=' + $scope.subprj_id).success(
                function (res) {
                    $scope.opt_prj_list = res;
                    $scope.imglist = new Array();
                    for (var i = 0; i < $scope.opt_prj_list.length; i++) {
                        $scope.imglist[i] = $scope.opt_prj_list[i].headimgurl;
                    }
                    $scope.imglist = DropRepeat($scope.imglist);
                    console.log($scope.imglist);
                }).error(function () {
                alert("an unexpected error ocurred!");
            })
        }
    )


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
    projectService.taskgroup_task_list($scope.subprj_id).then(
        function (res) {
            $scope.task_list = res.data;
            for (var i = 0; i < $scope.task_list.length; i++) {
                $scope.task_list[i]['length'] = $scope.task_list[i].subtask_list.length;
            }
        }
    )
    //新建总任务
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
    //新建子任务
    $scope.taskGroupChose = function (id, index) {
        $scope.tasktype = 'father';
        $scope.taskgoup_name = $scope.task_list[index].name;
        console.log($scope.taskgoup_name);
        $scope.subtask_info.taskgroup_id = id;
    }
    $scope.newSubTask = function () {
        $scope.subtask_info.creator_id = $cookies.get('openid');
        $scope.subtask_info.end_time_plan = $scope.t1.year + '-' + $scope.t1.month + '-' + $scope.t1.day;
        ;

        console.log($scope.subtask_info);
        projectService.add_task($scope.subtask_info).then(
            function (res) {
                console.log(res.data);
            }
        )
    }
    $scope.subTaskChose = function (taskIndex, subTaskIndex) {
        $scope.tasktype = 'son';
        $scope.taskIndex = taskIndex;
        $scope.subTaskIndex = subTaskIndex;
        $scope.subtask_info.subtask_name = $scope.task_list[taskIndex].subtask_list[subTaskIndex].name;
        $scope.subtask_info.chargerNickname = $scope.task_list[taskIndex].subtask_list[subTaskIndex].changer_nickname;
        $scope.subtask_info.changer_id = $scope.task_list[taskIndex].subtask_list[subTaskIndex].changer_id;
        $scope.subtask_info.urgent = $scope.task_list[taskIndex].subtask_list[subTaskIndex].urgent;
        $scope.subtask_info.remarks = $scope.task_list[taskIndex].subtask_list[subTaskIndex].remarks;

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
    document.getElementById("container1").style.display = 'inline-block';
    $('#container1').ready(function () {
        var chart = {
            zoomType: 'xy'
        };
        var title = {
            text: ''
        };
        var xAxis = {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            crosshair: true
        };

        var series = [{
            name: '已完成',
            type: 'spline', /*
            yAxis: 1,*/
            data: [7.0, 49, 9.5, 14.5, 18.2, 21.5, 25.2,
                26.5, 23.3, 18.3, 13.9, 9.6],
            tooltip: {
                valueSuffix: ''
            }
        }, {
            name: '未完成',
            type: 'spline',
            yAxis: 1,
            data: [7.0, 6.9, 9.5, 10.5, 18.2, 21.5, 25.2,
                26.5, 23.3, 18.3, 13.9, 9.6],
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
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
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


    //
    var menu = false;
    $scope.showMenu = function () {
        menu = !menu;
        if (menu)
            document.getElementById('prj_menu').style.display = 'inline-block';
        else
            document.getElementById('prj_menu').style.display = 'none';
    }
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
        $scope.query = x;
    }
})

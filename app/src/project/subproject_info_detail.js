var subproject_info_detail = angular.module('subproject_info_detail', ['ngResource', 'ngCookies']);
subproject_info_detail.controller('subproject_info_detailCtrl', function ($scope, $http, $filter, $timeout, $interval, $window,
                                                                          $stateParams, $state, $cookies, $location,
                                                                          $rootScope, projectService) {

    var time = new Date();
    var winHeight = document.body.clientHeight;
    document.getElementById("prjDT_opt").style.height= winHeight*0.6 +"px";
    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 1);
    $rootScope.fromIPM = $cookies.get('fromIPM');
    $rootScope.set_prj = $cookies.get('set_prj');
    $scope.prj_id = $stateParams.prj_id;
    $scope.paramFromIPM = JSON.parse($cookies.get('paramFromIPM'));
    if ($scope.paramFromIPM.subprj_id) {
        $scope.subprj_id = $scope.paramFromIPM.subprj_id;
    }
    else {
        $scope.subprj_id = $stateParams.subprj_id;
    }

    if ($scope.subprj_id) {
        $rootScope.menu = true;
    }
    else {
        $rootScope.menu = false;
    }
    $scope.task_group_info = {};
    $scope.subtask_info = {};
    $scope.subtask_info.subtask_name = "选择类型";
    $scope.subtask_info.emergency = "普通";
    $scope.subtask_info.urgent = 1;
    $scope.subtask_info.partitionNickname = new Array();
    $scope.subtask_info.parter = new Array();

    $scope.userinfo = {};
    $scope.userinfo.openid = $cookies.get('openid');
    $scope.userinfo.company_id = $cookies.get('company_id');
    $scope.userinfo.status = $cookies.get('status');
    $scope.subprj_state = $cookies.get('subprj_state');

    $scope.refrash_task = false;

    $scope.prj_name = $cookies.get('prj_name');
    $scope.subprj_name = $cookies.get('subprj_name');

    $scope.getProjectTrailInfos = function () {

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


    $scope.projectRoleList = function () {
        projectService.project_role_list($scope.subprj_id).then(
            function (res) {
                $scope.prj_role_list = res.data;
                for (var i = 0; i < $scope.prj_role_list.length; i++) {
                    if ($scope.prj_role_list[i].openid == $cookies.get('openid')) {
                        $scope.newtaskAuthor = $scope.prj_role_list[i].roles.var_3;
                        break;
                    }
                }
                for(var j = 0;j<$scope.prj_role_list.length ;j++)
                {
                    $scope.prj_role_list[j].role_master_bl = false;
                    if(($scope.prj_role_list[j].roles_master & Math.pow(2,($scope.role_group-1))) == Math.pow(2,($scope.role_group-1)))
                    {
                        $scope.prj_role_list[j].role_master_bl = true;
                    }
                }
            }
        )
    }


    projectService.month_task_list($scope.subprj_id).then(
        function (res) {
            $rootScope.time_x = [];
            $rootScope.done = [];
            $rootScope.done_sum = 0;
            $rootScope.sum_1 = [];
            $rootScope.sum_1_sum = 0;
            for (var i = 1; i < res.data.length; i++) {
                $rootScope.time_x.push(res.data[i].time);
                $rootScope.done.push( res.data[i].sum);
                $rootScope.done_sum = $rootScope.done_sum + parseInt(res.data[i].sum);
                $rootScope.sum_1.push(parseInt(res.data[i].sum_1));
                $rootScope.sum_1_sum = $rootScope.sum_1_sum + parseInt(res.data[i].sum_1);
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
                name: '总任务',
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
        var exsit = false;
        for (var i = 0; i < $scope.subtask_info.parter.length; i++) {
            if ($scope.subtask_info.parter[i] == openid) {
                exsit = true;
                break;
            }
        }
        if (exsit) {
            $scope.removePartition(nickname);
        }
        $scope.subtask_info.chargerNickname = nickname;
        $scope.subtask_info.changer_id = openid;
    }

    $scope.role_seletct = function (x) {
        $scope.role_partition = x;
    }
    //设置子任务参与者
    $scope.partitionChose = function (nickname, openid) {
        var exsit = false;
        if (openid == $scope.subtask_info.changer_id) {
            alert("已设置为负责人!");


        }
        else {
            for (var i = 0; i < $scope.subtask_info.parter.length; i++) {
                if ($scope.subtask_info.parter[i] == openid) {
                    exsit = true;
                    break;
                }
            }
            if (exsit) {
                alert('已经添加过了');
            }
            else {
                $('#modal-form2_1').modal('hide');
                $scope.subtask_info.partitionNickname.push(nickname);
                $scope.subtask_info.parter.push(openid);
                exsit = false;
            }
        }
    }
    //设置子项目参与者的时候  先判断是否role_id为6
    $scope.partitionIsCheck =function(subprj_id){
        projectService.select_check_charger(subprj_id).then(
            function (res) {
                $scope.partition_ischeck = res.data;
            }
        )
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
    taskgroupTaskList = function () {
        $scope.paramFromIPM.subprj_id = $scope.subprj_id;
        projectService.taskgroup_task_list($scope.paramFromIPM).then(
            function (res) {
                $scope.task_list = res.data;
                var nowdate = new Date();
                nowdate = $filter('date')(nowdate, "yyyy-MM-dd");
                for (var i = 0; i < $scope.task_list.length; i++) {
                    $scope.task_list[i]['length'] = $scope.task_list[i].subtask_list.length;
                    for (var j = 0; j < $scope.task_list[i].subtask_list.length; j++) {
                        var endtime = $scope.task_list[i].subtask_list[j].end_time_plan;
                        if(endtime !='' &&endtime !=null &&endtime !=undefined)
                        {
                            //重设紧急度
                            var str = $scope.task_list[i].subtask_list[j].end_time_plan.toString();
                            str = str.replace("/-/g", "/");
                            var temp = new Date(str);
                            $scope.task_list[i].subtask_list[j].countdown = 0;
                            if(temp.getFullYear() == time.getFullYear() && temp.getMonth()==time.getMonth() &&temp.getDate() == time.getDate())
                            {

                                if(temp.getHours()-time.getHours()<=4)
                                {
                                    $scope.task_list[i].subtask_list[j].countdown =1;
                                    $scope.task_list[i].subtask_list[j].countdown_time =temp.getHours()-time.getHours();
                                }
                                else if(temp.getHours()-time.getHours()<=8){
                                    $scope.task_list[i].subtask_list[j].countdown =2;
                                    $scope.task_list[i].subtask_list[j].countdown_time =temp.getHours()-time.getHours();
                                }
                            }
                            //$scope.task_list[i].subtask_list[j].end_time_plan = $scope.task_list[i].subtask_list[j].end_time_plan.substring(0, 10);

                        }
                    }
                }
            }
        )
    }
    taskgroupTaskList();

    $scope.group_list =function () {
        projectService.group_list().then(
            function (res) {
                $scope.grp_list = res.data;
                $cookies.put('grp_list', JSON.stringify($scope.grp_list), {'expires': expireDate});
            }
        )
    }


    //新建总任务
    $scope.newTaskGroup = function () {
        if($scope.role_name == '' || $scope.role_name == undefined)
        {
          alert("先选择角色权限！");
        }
        else{
            $scope.task_group_info.subprj_id = $scope.subprj_id;
            $scope.task_group_info.openid = $cookies.get('openid');
            $scope.task_group_info.role_id = $scope.role_id;
            projectService.add_taskgroup($scope.task_group_info).then(
                function (res) {
                    //$window.location.reload();
                    //taskgroupTaskList();

                    //******************************************
                    $scope.paramFromIPM.subprj_id = $scope.subprj_id;
                    projectService.taskgroup_task_list($scope.paramFromIPM).then(
                        function (res) {
                            $scope.task_list = res.data;
                            var nowdate = new Date();
                            nowdate = $filter('date')(nowdate, "yyyy-MM-dd hh:mm:ss");
                            for (var i = 0; i < $scope.task_list.length; i++) {
                                $scope.task_list[i]['length'] = $scope.task_list[i].subtask_list.length;
                                for (var j = 0; j < $scope.task_list[i].subtask_list.length; j++) {
                                    var endtime = $scope.task_list[i].subtask_list[j].end_time_plan;
                                    if(endtime !='' &&endtime !=null &&endtime !=undefined)
                                    {

                                    }
                                        //$scope.task_list[i].subtask_list[j].end_time_plan = $scope.task_list[i].subtask_list[j].end_time_plan.substring(0, 10);
                                }
                            }
                        }
                    )
                    //******************************************
                }
            )
        }

    }
    //删除总任务
    $scope.delTaskgroup = function (taskgoup_id) {
        projectService.del_taskgroup(taskgoup_id).then(
            function (res) {
                if (!res.data.success) {
                    alert("有已完成的子任务，总任务无法删除！");
                }
                else {
                    alert("删除成功！");
                    $scope.refrash_task = !$scope.refrash_task;
                    //$window.location.reload();
                    //taskgroupTaskList();
                    //******************************************
                    $scope.paramFromIPM.subprj_id = $scope.subprj_id;
                    projectService.taskgroup_task_list($scope.paramFromIPM).then(
                        function (res) {
                            $scope.task_list = res.data;
                            var nowdate = new Date();
                            nowdate = $filter('date')(nowdate, "yyyy-MM-dd hh:mm:ss");
                            for (var i = 0; i < $scope.task_list.length; i++) {
                                $scope.task_list[i]['length'] = $scope.task_list[i].subtask_list.length;
                                for (var j = 0; j < $scope.task_list[i].subtask_list.length; j++) {
                                    var endtime = $scope.task_list[i].subtask_list[j].end_time_plan;
                                    if(endtime !='' &&endtime !=null &&endtime !=undefined)
                                    {
                                        //$scope.task_list[i].subtask_list[j].end_time_plan = $scope.task_list[i].subtask_list[j].end_time_plan.substring(0, 10);
                                    }

                                }
                            }
                        }
                    )
                    //******************************************
                }
            }
        )
    }
    //选中总任务
    $scope.taskGroupChose = function (id, index) {
        $scope.tasktype = 'father';
        $scope.subtask_info = {};
        $scope.subtask_info.subtask_name = "选择类型";
        $scope.subtask_info.subtask_id = '';
        $scope.subtask_info.taskgroup_id = id;
        $scope.subtask_info.partitionNickname = [];
        $scope.subtask_info.parter = [];
        $scope.subtask_info.urgent =1;

        $scope.taskgoup_name = $scope.task_list[index].name;
        $scope.taskgoup_id = $scope.task_list[index].id;


        $scope.role_group = $scope.task_list[index].role_id;
    }
    //新建子任务
    $scope.newSubTask = function () {
        $scope.subtask_info.creator_id = $cookies.get('openid');
        $scope.subtask_info.end_time_plan = $scope.t1.year + '-' + $scope.t1.month + '-' + $scope.t1.day +'-' +$scope.t1.hour +':'+$scope.t1.minute+':'+$scope.t1.second;
        projectService.add_task($scope.subtask_info).then(
            function (res) {
                //$window.location.reload();
                //******************************************
                $scope.paramFromIPM.subprj_id = $scope.subprj_id;
                projectService.taskgroup_task_list($scope.paramFromIPM).then(
                    function (res) {
                        $scope.task_list = res.data;
                        var nowdate = new Date();
                        nowdate = $filter('date')(nowdate, "yyyy-MM-dd hh:mm:ss");
                        for (var i = 0; i < $scope.task_list.length; i++) {
                            $scope.task_list[i]['length'] = $scope.task_list[i].subtask_list.length;
                            for (var j = 0; j < $scope.task_list[i].subtask_list.length; j++) {
                                var endtime = $scope.task_list[i].subtask_list[j].end_time_plan;
                                if(endtime !='' &&endtime !=null &&endtime !=undefined)
                                {
                                    //重设紧急度
                                    var str = $scope.task_list[i].subtask_list[j].end_time_plan.toString();
                                    str = str.replace("/-/g", "/");
                                    var temp = new Date(str);
                                    $scope.task_list[i].subtask_list[j].countdown =0;
                                    if(temp.getFullYear() == time.getFullYear() && temp.getMonth()==time.getMonth() &&temp.getDate() == time.getDate())
                                    {
                                        if(temp.getHours()-time.getHours()<=4)
                                        {
                                            $scope.task_list[i].subtask_list[j].countdown =1;
                                            $scope.task_list[i].subtask_list[j].countdown_time =temp.getHours()-time.getHours();
                                        }
                                        else if(temp.getHours()-time.getHours()<=8){
                                            $scope.task_list[i].subtask_list[j].countdown =2;
                                            $scope.task_list[i].subtask_list[j].countdown_time =temp.getHours()-time.getHours();
                                        }
                                    }
                                    //$scope.task_list[i].subtask_list[j].end_time_plan = $scope.task_list[i].subtask_list[j].end_time_plan.substring(0, 10);

                                }

                            }
                        }
                    }
                )
                //******************************************
            }
        )
    }
    //保存子任务修改
    $scope.saveSubTask = function () {
        if ($scope.subtask_info.state != 1)
            alert("项目已完成，无法修改！");
        else {
            $scope.subtask_info.creator_id = $cookies.get('openid');
            $scope.subtask_info.taskgroup_id = $scope.task_list[$scope.taskIndex].id;
            $scope.subtask_info.end_time_plan = $scope.t1.year + '-' + $scope.t1.month + '-' + $scope.t1.day+'-'+$scope.t1.hour +':'+$scope.t1.minute+':'+$scope.t1.second;
            projectService.add_task($scope.subtask_info).then(
                function (res) {
                    if (!res.data.success) {
                        alert('修改失败！');
                    }
                    else {
                        //$window.location.reload();
                        //******************************************
                        $scope.paramFromIPM.subprj_id = $scope.subprj_id;
                        projectService.taskgroup_task_list($scope.paramFromIPM).then(
                            function (res) {
                                $scope.task_list = res.data;
                                var nowdate = new Date();
                                nowdate = $filter('date')(nowdate, "yyyy-MM-dd hh:mm:ss");
                                for (var i = 0; i < $scope.task_list.length; i++) {
                                    $scope.task_list[i]['length'] = $scope.task_list[i].subtask_list.length;
                                    for (var j = 0; j < $scope.task_list[i].subtask_list.length; j++) {
                                        var endtime = $scope.task_list[i].subtask_list[j].end_time_plan;
                                        if(endtime !='' &&endtime !=null &&endtime !=undefined)
                                        {
                                            //重设紧急度
                                            var str = $scope.task_list[i].subtask_list[j].end_time_plan.toString();
                                            str = str.replace("/-/g", "/");
                                            var temp = new Date(str);
                                            $scope.task_list[i].subtask_list[j].countdown =0;
                                            if(temp.getFullYear() == time.getFullYear() && temp.getMonth()==time.getMonth() &&temp.getDate() == time.getDate())
                                            {
                                                if(temp.getHours()-time.getHours()<=4)
                                                {
                                                    $scope.task_list[i].subtask_list[j].countdown =1;
                                                    $scope.task_list[i].subtask_list[j].countdown_time =temp.getHours()-time.getHours();
                                                }
                                                else if(temp.getHours()-time.getHours()<=8){
                                                    $scope.task_list[i].subtask_list[j].countdown =2;
                                                    $scope.task_list[i].subtask_list[j].countdown_time =temp.getHours()-time.getHours();
                                                }
                                            }
                                            //$scope.task_list[i].subtask_list[j].end_time_plan = $scope.task_list[i].subtask_list[j].end_time_plan.substring(0, 10);

                                        }

                                    }
                                }
                            }
                        )
                        //******************************************
                    }
                }
            )
        }
    }
    //删除子任务
    $scope.delTask = function (task_id) {
        projectService.del_task(task_id).then(
            function (res) {
                if (!res.data.success) {
                    alert("任务已完成，无法删除！");
                }
                else {
                    alert("删除成功！");
                    //$window.location.reload();
                    //******************************************
                    $scope.paramFromIPM.subprj_id = $scope.subprj_id;
                    projectService.taskgroup_task_list($scope.paramFromIPM).then(
                        function (res) {
                            $scope.task_list = res.data;
                            var nowdate = new Date();
                            nowdate = $filter('date')(nowdate, "yyyy-MM-dd hh:mm:ss");
                            for (var i = 0; i < $scope.task_list.length; i++) {
                                $scope.task_list[i]['length'] = $scope.task_list[i].subtask_list.length;
                                for (var j = 0; j < $scope.task_list[i].subtask_list.length; j++) {
                                    var endtime = $scope.task_list[i].subtask_list[j].end_time_plan;
                                    if(endtime !='' &&endtime !=null &&endtime !=undefined)
                                    {
                                        //$scope.task_list[i].subtask_list[j].end_time_plan = $scope.task_list[i].subtask_list[j].end_time_plan.substring(0, 10);
                                    }

                                }
                            }
                        }
                    )
                    //******************************************
                }
            }
        )
    }

    //选中子任务
    $scope.subTaskChose = function (taskIndex, subTaskIndex) {
        $scope.t1 = {};
        $scope.tasktype = 'son';
        $scope.taskIndex = taskIndex;
        $scope.role_group = $scope.task_list[taskIndex].role_id;
        $scope.taskgoup_name = $scope.task_list[taskIndex].name;
        $scope.subTaskIndex = subTaskIndex;
        $scope.subtask_info.subtask_id = $scope.task_list[taskIndex].subtask_list[subTaskIndex].id;
        $scope.subtask_info.subtask_name = $scope.task_list[taskIndex].subtask_list[subTaskIndex].name;
        $scope.subtask_info.chargerNickname = $scope.task_list[taskIndex].subtask_list[subTaskIndex].changer_nickname;
        $scope.subtask_info.changer_id = $scope.task_list[taskIndex].subtask_list[subTaskIndex].changer_id;
        $scope.subtask_info.urgent = $scope.task_list[taskIndex].subtask_list[subTaskIndex].urgent;
        $scope.subtask_info.remarks = $scope.task_list[taskIndex].subtask_list[subTaskIndex].remarks;
        $scope.subtask_info.partitionNickname = [];
        $scope.subtask_info.parter = [];
        $scope.subtask_info.state = $scope.task_list[taskIndex].subtask_list[subTaskIndex].state;
        for (var i = 0; i < $scope.task_list[taskIndex].subtask_list[subTaskIndex].parter_list.length; i++) {
            $scope.subtask_info.partitionNickname.push($scope.task_list[taskIndex].subtask_list[subTaskIndex].parter_list[i].nickname);
            $scope.subtask_info.parter.push($scope.task_list[taskIndex].subtask_list[subTaskIndex].parter_list[i].openid);
        }
        var remindTime = $scope.task_list[taskIndex].subtask_list[subTaskIndex].end_time_plan;
        if(remindTime != '' && remindTime != null &&remindTime!=undefined)
        {
            var str = remindTime.toString();
            str = str.replace("/-/g", "/");
            var t1_temp = new Date(str);

            $scope.t1.year = t1_temp.getFullYear();
            $scope.t1.month = t1_temp.getMonth() + 1;
            $scope.t1.day = t1_temp.getDate();
            $scope.t1.hour = t1_temp.getHours();
            $scope.t1.minute = t1_temp.getMinutes();
            $scope.t1.second = t1_temp.getSeconds();

            $('#timepicker1').val($scope.t1.year+'-'+$scope.t1.month+'-'+$scope.t1.day+' '+$scope.t1.hour+':'+$scope.t1.minute+':'+$scope.t1.second);
        }
        //获取任务轨迹
        projectService.get_project_tasktrailinfos($scope.subtask_info).then(
            function (res) {
                $scope.subtask_info.task_trail_info = res.data;
                $scope.t1 = $scope.t1;
            }
        )
    }

    $scope.t1 = {
        year: time.getFullYear(),
        month: time.getMonth() + 1,
        day: time.getDate(),
        hour: time.getHours(),
        minute: time.getMinutes(),
        second:time.getSeconds(),
    };
    if ($scope.t1.month < 10)
        $scope.t1.month = "0" + $scope.t1.month;
    //时间选择器1
    $("#timepicker1").datetimepicker({
        language: 'zh-CN',
        format: "yyyy-mm-dd hh:ii:ss",
        startView: 3,
        minView:0,
        autoclose: true,
        todayBtn: true,
        pickerPosition: "bottom-left"}).on('changeMinute', function (ev) {
        $scope.t1.year = ev.date.getFullYear();
        $scope.t1.month = ev.date.getMonth() + 1;
        $scope.t1.day = ev.date.getUTCDate();
        $scope.t1.hour = ev.date.getUTCHours();
        $scope.t1.minute = ev.date.getMinutes();
    }).on("hide", function () {
        $("#timepicker1").blur();
    });

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
        if (x == 'app/build/image/all.jpg')
            $scope.query = '';
        else
            $scope.query = x;
    }
    $(".popover-options a").popover({html: true});
});

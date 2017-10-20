var project = angular.module('project', ['ngResource', 'ngCookies']);
project.controller('projectCtrl', function ($scope, $http, $timeout, $interval,$window, $state, $cookies, $rootScope, projectService) {

    $scope.userinfo = {};
    $scope.prjinfo = {};
    $scope.subprjinfo = {};
    $scope.rolesinfo = {};
    $scope.removeinfo = {};
    $scope.roles = new Array();

    $scope.oldtb = true;
    $scope.create_sub = false;
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
                for (var i = 0; i < $scope.usr_list.length; i++) {
                    $scope.usr_list[i]['show'] = true;
                    $scope.usr_list[i]['check'] = new Array();
                    $scope.usr_list[i]['check'][0] = false;
                    $scope.usr_list[i]['check'][1] = false;
                    $scope.usr_list[i]['check'][2] = false;
                    $scope.usr_list[i]['check'][3] = false;
                    $scope.usr_list[i]['check'][4] = false;
                }
                console.log($scope.usr_list);
            }
        )
    };
    configurationlist = function () {
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
        $scope.index = index;
        console.log(index);
    }
    $scope.newprj = function () {
        $scope.prjinfo.company_id = $cookies.get('company_id');
        $scope.prjinfo.creator_id = $cookies.get('openid');
        $scope.prjinfo.start_time_plan = $scope.t1.year + '-' + $scope.t1.month + '-' + $scope.t1.day;
        $scope.prjinfo.end_time_plan = $scope.t2.year + '-' + $scope.t2.month + '-' + $scope.t2.day;
        $scope.prjinfo.create_sub = $scope.create_sub;
        console.log($scope.prjinfo);
        projectService.new_project($scope.prjinfo).then(
            function (res) {
                console.log(res.data);
                $window.location.reload();
            }
        )
    };
    $scope.chose = function (prjid) {
        $scope.prjinfo.prj_id = prjid;
        console.log($scope.prjinfo.prj_id);
    }
    $scope.subchose = function (prjid) {
        $scope.rolesinfo.subprj_id = prjid;
        console.log($scope.rolesinfo.subprj_id);
        projectService.project_role_list($scope.rolesinfo.subprj_id).then(
            function (res) {
                $scope.prj_role_list = res.data;
                console.log($scope.prj_role_list);
                var ifexist = false;
                for (var i = 0; i < $scope.usr_list.length; i++) {
                    for (var j = 0; j < $scope.prj_role_list.length; j++) {
                        if ($scope.usr_list[i].openid == $scope.prj_role_list[j].openid) {
                            ifexist = true;

                        }
                        console.log(ifexist);
                    }
                    if(ifexist)
                    {
                        $scope.usr_list[i]['show'] = false;
                        ifexist = false;
                        console.log($scope.usr_list);
                    }
                }
            }
        )

    }
    $scope.newsubprj = function () {
        $scope.subprjinfo.prj_id = $scope.prjinfo.prj_id;
        $scope.subprjinfo.company_id = $cookies.get('company_id');
        $scope.subprjinfo.creator_id = $cookies.get('openid');
        $scope.subprjinfo.start_time_plan = $scope.t5.year + '-' + $scope.t5.month + '-' + $scope.t5.day;
        $scope.subprjinfo.end_time_plan = $scope.t6.year + '-' + $scope.t6.month + '-' + $scope.t6.day;
        console.log($scope.subprjinfo);
        projectService.new_subproject($scope.subprjinfo).then(
            function (res) {
                console.log(res.data);
                $window.location.reload();
            }
        )
    };
    $scope.hide = function (index) {
        $scope.roles.length = 0;
        $scope.usr_list[index]['show'] = false;
        //$scope.rolejl = false;
        //$scope.rolezj = false;
        //$scope.rolejc = false;
        //$scope.rolepm = false;
        //$scope.roledt = false;
        if ($scope.usr_list[index]['check'][0] == true) {
            $scope.roles.push(1);
        }
        if ($scope.usr_list[index]['check'][1] == true) {
            $scope.roles.push(2);
        }
        if ($scope.usr_list[index]['check'][2] == true) {
            $scope.roles.push(3);
        }
        if ($scope.usr_list[index]['check'][3] == true) {
            $scope.roles.push(4);
        }
        if ($scope.usr_list[index]['check'][4] == true) {
            $scope.roles.push(5);
        }
        console.log($scope.roles);

        $scope.rolesinfo.company_id = $cookies.get('company_id');
        $scope.rolesinfo.creator_id = $cookies.get('openid');
        $scope.rolesinfo.start_time_plan = $scope.t3.year + '-' + $scope.t3.month + '-' + $scope.t3.day;
        $scope.rolesinfo.end_time_plan = $scope.t4.year + '-' + $scope.t4.month + '-' + $scope.t4.day;
        $scope.rolesinfo.openid = $scope.usr_list[index].openid;
        $scope.rolesinfo.roleid = $scope.roles;
        projectService.add_role($scope.rolesinfo).then(
            function (res) {
            }
        )
    }
    $scope.remove = function (openid) {
        console.log(openid);
        $scope.removeinfo.openid = openid;
        $scope.removeinfo.subproject_id = $scope.rolesinfo.subprj_id;
        projectService.del_project_role($scope.removeinfo).then(
            function (res) {
            }
        )

    }
    $scope.delSubproject = function (subproject_id) {
        projectService.del_subproject(subproject_id).then(
            function (res) {
            }
        )
    }
    $scope.delConf = function (conf_id) {
        projectService.del_config(conf_id).then(
            function (res) {
                console.log(res.data);
                if(!res.data.success)
                {
                    alert("此配置正在被使用，无法删除！");
                }
            }
        )
    }

    var time = new Date();
    $scope.t1 = {
        year: time.getFullYear(),
        month: time.getMonth() + 1,
        day: time.getDate()
    };
    $scope.t2 = {
        year: time.getFullYear(),
        month: time.getMonth() + 1,
        day: time.getDate()
    };
    $scope.t3 = {
        year: time.getFullYear(),
        month: time.getMonth() + 1,
        day: time.getDate()
    };
    $scope.t4 = {
        year: time.getFullYear(),
        month: time.getMonth() + 1,
        day: time.getDate()
    };
    $scope.t5 = {
        year: time.getFullYear(),
        month: time.getMonth() + 1,
        day: time.getDate()
    };
    $scope.t6 = {
        year: time.getFullYear(),
        month: time.getMonth() + 1,
        day: time.getDate()
    };
    if ($scope.t1.month < 10)
        $scope.t1.month = "0" + $scope.t1.month;
    if ($scope.t2.month < 10)
        $scope.t2.month = "0" + $scope.t2.month;
    if ($scope.t3.month < 10)
        $scope.t3.month = "0" + $scope.t3.month;
    if ($scope.t4.month < 10)
        $scope.t4.month = "0" + $scope.t4.month;
    if ($scope.t5.month < 10)
        $scope.t5.month = "0" + $scope.t5.month;
    if ($scope.t6.month < 10)
        $scope.t6.month = "0" + $scope.t6.month;

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
    $("#timepicker3").datetimepicker({
        language: 'zh-CN',
        format: "yyyy-mm-dd",
        startView: 3,
        minView: 2,
        autoclose: true,
        todayBtn: false,
        pickerPosition: "bottom-left"
    }).on('changeDay', function (ev) {
        $scope.t3.year = ev.date.getFullYear();
        $scope.t3.month = ev.date.getMonth() + 1;
        $scope.t3.day = ev.date.getDate();
        console.log('t3' + JSON.stringify($scope.t1) + 't4' + JSON.stringify($scope.t2));
        if ($scope.project_id) {
            //$scope.changecharts($scope.project_id, $scope.t1.year + '-' + $scope.t1.month +'-' +$scope.t1.day, $scope.t2.year + '-' + $scope.t2.month + '-' + $scope.t2.day);
        }
    }).on("hide", function () {
        $("#timepicker3").blur();
    });
    //时间选择器2
    $("#timepicker4").datetimepicker({
        language: 'zh-CN',
        format: "yyyy-mm-dd",
        startView: 3,
        minView: 2,
        autoclose: true,
        todayBtn: false,
        pickerPosition: "bottom-left"
    }).on('changeDay', function (ev) {
        $scope.t4.year = ev.date.getFullYear();
        $scope.t4.month = ev.date.getMonth() + 1;
        $scope.t4.day = ev.date.getDate();
        console.log('t3' + JSON.stringify($scope.t1) + 't4' + JSON.stringify($scope.t2));
        if ($scope.project_id) {
            //$scope.changecharts($scope.project_id, $scope.t.year + '-' + $scope.t1.month, $scope.t2.year + '-' + $scope.t2.month);
        }
    }).on("hide", function () {
        $("#timepicker4").blur();
    });
    //时间选择器2
    $("#timepicker5").datetimepicker({
        language: 'zh-CN',
        format: "yyyy-mm-dd",
        startView: 3,
        minView: 2,
        autoclose: true,
        todayBtn: false,
        pickerPosition: "bottom-left"
    }).on('changeDay', function (ev) {
        $scope.t5.year = ev.date.getFullYear();
        $scope.t5.month = ev.date.getMonth() + 1;
        $scope.t5.day = ev.date.getDate();
        console.log('t5' + JSON.stringify($scope.t1) + 't6' + JSON.stringify($scope.t2));
        if ($scope.project_id) {
            //$scope.changecharts($scope.project_id, $scope.t.year + '-' + $scope.t1.month, $scope.t2.year + '-' + $scope.t2.month);
        }
    }).on("hide", function () {
        $("#timepicker5").blur();
    });
    //时间选择器2
    $("#timepicker6").datetimepicker({
        language: 'zh-CN',
        format: "yyyy-mm-dd",
        startView: 3,
        minView: 2,
        autoclose: true,
        todayBtn: false,
        pickerPosition: "bottom-left"
    }).on('changeDay', function (ev) {
        $scope.t6.year = ev.date.getFullYear();
        $scope.t6.month = ev.date.getMonth() + 1;
        $scope.t6.day = ev.date.getDate();
        console.log('t5' + JSON.stringify($scope.t1) + 't6' + JSON.stringify($scope.t2));
        if ($scope.project_id) {
            //$scope.changecharts($scope.project_id, $scope.t.year + '-' + $scope.t1.month, $scope.t2.year + '-' + $scope.t2.month);
        }
    }).on("hide", function () {
        $("#timepicker6").blur();
    });
})

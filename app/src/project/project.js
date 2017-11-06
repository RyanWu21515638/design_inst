var project = angular.module('project', ['ngResource', 'ngCookies']);
project.controller('projectCtrl', function ($scope, $http, $filter,$timeout, $interval, $window, $state, $cookies, $location,
                                            $rootScope, projectService) {
    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 1);

    $scope.userinfo = {};               //用户信息
    $scope.prjinfo = {};                //创建总项目信息
    $scope.subprjinfo = {};             //创建子项目信息
    $scope.rolesinfo = {};              //子项目已分配的人员信息
    $scope.removeinfo = {};             //移除的已分配的人员信息
    $scope.downloadinfo = {};           //所有文件下载链接列表
    $scope.roles = new Array();         //给某个人员分配权限
    $rootScope.menu = false;
    $rootScope.fromIPM = $cookies.get('fromIPM');
    console.log($rootScope.fromIPM);
    //获取用户微信id，公司id，设计院权限--可设置成全局变量
    //
    $scope.userinfo.openid = $cookies.get('openid');
    $scope.userinfo.company_id = $cookies.get('company_id');
    $scope.userinfo.headimgurl = $cookies.get('headimgurl');
    $scope.userinfo.company_name = $cookies.get('company_name');
    $scope.userinfo.nickname = $cookies.get('nickname');
    $scope.userinfo.status = $cookies.get('status');

    $scope.paramFromIPM = $location.search();
    $cookies.put('paramFromIPM', JSON.stringify($scope.paramFromIPM), {'expires': expireDate});

    if ($location.search().login_id != undefined && $location.search().login_id != '' && $location.search().login_id != null) {
        $scope.userinfo.openid = $location.search().login_id;
        $cookies.put('fromIPM', true, {'expires': expireDate});
    }
    else {
        $scope.userinfo.openid = $cookies.get('openid');
    }
    selectUser = function (openid) {
        $http.get($rootScope.ip + "/design_institute/public/admin/user/selectUser?openid=" + openid).success(
            function (res) {
                if (res.company_id) {
                    $scope.logged = 'true';
                    $cookies.put('logged', 'true', {'expires': expireDate});
                    $cookies.put('status', res.status, {'expires': expireDate});
                    $cookies.put('company_id', res.company_id, {'expires': expireDate});
                    $cookies.put('company_name', res.company_name, {'expires': expireDate});
                    $cookies.put('headimgurl', res.headimgurl, {'expires': expireDate});
                    $cookies.put('nickname', res.nickname, {'expires': expireDate});
                    $cookies.put('openid', $scope.userinfo.openid, {'expires': expireDate});
                    $cookies.put('issystem', res.remark, {'expires': expireDate});
                    $window.location.reload();
                }
            }
        )
    };
    console.log($cookies.get('openid'));
    console.log($location.search().login_id);

    if ($cookies.get('openid') == undefined || $cookies.get('openid') == '' || $cookies.get('openid') == null ||
        ($cookies.get('openid') != $location.search().login_id && $location.search().login_id != undefined)) {
        console.log($location.search().login_id);
        selectUser($location.search().login_id);
    }

    //获取所有项目列表--包括总项目下面的子项目
    projectList = function () {
        console.log('获取项目信息');
        projectService.project_list($scope.userinfo).then(
            function (res) {
                $scope.prj_list = res.data;
                $rootScope.prj_list = res.data;
                var dn = new Date();
                dn = $filter('date')(dn, "yyyy-MM-dd");
                //每个项目时间节点计算
                for (var jj = 0; jj < $scope.prj_list.length; jj++) {
                    for (var jjj = 0; jjj < $scope.prj_list[jj].subproject_list.length; jjj++) {
                        var da1 = $scope.prj_list[jj].subproject_list[jjj].end_time_plan;

                        var D_value = (da1.split('-')[0]-dn.split('-')[0])*365
                                    + (da1.split('-')[1]-dn.split('-')[1])*30
                                    + (da1.split('-')[2]-dn.split('-')[2]);
                        $scope.prj_list[jj].subproject_list[jjj]['D_value'] = D_value;
                    }
                }
                console.log(dn);

                console.log($location.search().subprj_id);
                var sub_if_go = $location.search().subprj_id;
                if (sub_if_go) {
                    for (var i = 0; i < $scope.prj_list.length; i++) {
                        for (var j = 0; j < $scope.prj_list[i].subproject_list.length; j++)
                            if ($scope.prj_list[i].subproject_list[j].subproject_id == $location.search().subprj_id) {
                                $scope.prj_id_params = $scope.prj_list[i].project_id;
                                break;
                            }
                    }
                    for (var j = 0; j < $scope.prj_list.length; j++) {
                        if ($scope.prj_list[j].project_id == $scope.prj_id_params) {
                            $scope.prj_name = $scope.prj_list[j].name;
                            $cookies.put('prj_name',$scope.prj_name,{'expires': expireDate});
                            for (var jj = 0; jj < $scope.prj_list[j].subproject_list.length; jj++) {
                                if ($scope.prj_list[j].subproject_list[jj].subproject_id == $location.search().subprj_id)
                                {
                                    $scope.subprj_name = $scope.prj_list[j].subproject_list[jj].name;
                                    $cookies.put('subprj_name',$scope.prj_name,{'expires': expireDate});
                                }
                            }
                        }
                    }
                    $state.go("index.project.subproject_info_detail", {
                        prj_id: $scope.prj_id_params,
                        subprj_id: $location.search().subprj_id
                    });
                }
            }
        )
    };
    //获取所有设计院用户
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
                    $scope.usr_list[i]['check'][3] = false;
                    $scope.usr_list[i]['check'][4] = false;
                }
            }
        )
    };
    //获取公司配置列表
    $scope.configurationlist = function () {
        projectService.configuration_list($scope.userinfo).then(
            function (res) {
                $scope.conf_list = res.data;
            }
        )
    };
    //获取公司权限列表
    $scope.grouplist = function () {
        projectService.group_list().then(
            function (res) {
                $scope.grp_list = res.data;
                $cookies.put('grp_list', JSON.stringify($scope.grp_list), {'expires': expireDate});
            }
        )
    }
    //初始化--可在全局初始化
    projectList();
    userList();
    //configurationlist();
    //grouplist();

    //

    //选定总项目
    $scope.prj_dt = function (index, prjid, media) {
        //选定总项目
        $scope.index = index;
        $scope.prjinfo.prj_id = prjid;
        if (media == 2) {
            $state.go("index.project.subproject", {index: index});
        }
    }

    //新建总项目
    $scope.newprj = function () {
        $scope.prjinfo.company_id = $cookies.get('company_id');
        $scope.prjinfo.creator_id = $cookies.get('openid');
        $scope.prjinfo.start_time_plan = $scope.t1.year + '-' + $scope.t1.month + '-' + $scope.t1.day;
        $scope.prjinfo.end_time_plan = $scope.t2.year + '-' + $scope.t2.month + '-' + $scope.t2.day;

        projectService.new_project($scope.prjinfo).then(
            function (res) {
                if (res.data.success) {
                    $('#modal-form1').modal('hide');
                    projectList();
                }
            }
        )
    };
    //删除总项目
    $scope.delProject = function (prj_id) {
        projectService.del_project(prj_id).then(
            function (res) {
                projectList();
            }
        )
    }
    //新建子项目
    $scope.newsubprj = function () {
        $scope.subprjinfo.prj_id = $scope.prjinfo.prj_id;
        $scope.subprjinfo.company_id = $cookies.get('company_id');
        $scope.subprjinfo.creator_id = $cookies.get('openid');
        $scope.subprjinfo.start_time_plan = $scope.t5.year + '-' + $scope.t5.month + '-' + $scope.t5.day;
        $scope.subprjinfo.end_time_plan = $scope.t6.year + '-' + $scope.t6.month + '-' + $scope.t6.day;
        console.log($scope.subprjinfo);
        projectService.new_subproject($scope.subprjinfo).then(
            function (res) {
                if (res.data.success) {
                    $('#modal-form2').modal('hide');
                    projectList();
                }
            }
        )
    };
    //选定子项目
    $scope.subchose = function (prjid) {
        for (var i = 0; i < $scope.usr_list.length; i++) {
            $scope.usr_list[i]['show'] = true;
            $scope.usr_list[i]['check'] = new Array();
            $scope.usr_list[i]['check'][0] = false;
            $scope.usr_list[i]['check'][1] = false;
            $scope.usr_list[i]['check'][2] = false;
            $scope.usr_list[i]['check'][3] = false;
            $scope.usr_list[i]['check'][4] = false;
        }
        $scope.rolesinfo.subprj_id = prjid;

        projectService.project_role_list($scope.rolesinfo.subprj_id).then(
            function (res) {
                $scope.prj_role_list = res.data;
                $rootScope.prj_role_list = res.data;
                //$cookies.put('prj_role_list', '', {'expires': expireDate});

                //$cookies.put('prj_role_list', JSON.stringify($scope.prj_role_list), {'expires': expireDate});


                console.log('prj_role_list' + $scope.prj_role_list);
                var ifexist = false;
                for (var i = 0; i < $scope.usr_list.length; i++) {
                    for (var j = 0; j < $scope.prj_role_list.length; j++) {
                        if ($scope.usr_list[i].openid == $scope.prj_role_list[j].openid) {
                            ifexist = true;
                        }
                        console.log(ifexist);
                    }
                    if (ifexist) {
                        $scope.usr_list[i]['show'] = false;
                        ifexist = false;
                        console.log($scope.usr_list);
                    }
                }


            }
        )
    }
    //
    $scope.set_prj_suprj_name = function (subprj_id) {
        for (var j = 0; j < $scope.prj_list.length; j++) {
            if ($scope.prj_list[j].project_id == $scope.prjinfo.prj_id) {
                $scope.prj_name = $scope.prj_list[j].name;
                $cookies.put('prj_name',$scope.prj_name,{'expires': expireDate});
                for (var jj = 0; jj < $scope.prj_list[j].subproject_list.length; jj++) {
                    if ($scope.prj_list[j].subproject_list[jj].subproject_id == subprj_id)
                    {
                        $scope.subprj_name = $scope.prj_list[j].subproject_list[jj].name;
                        $cookies.put('subprj_name',$scope.prj_name,{'expires': expireDate});
                    }
                }
            }
        }
    }
    //
    $scope.downloadList = function (subproject_id) {
        $scope.downloadinfo.company_id = $cookies.get('company_id');
        $scope.downloadinfo.project_id = $scope.prjinfo.prj_id;
        $scope.downloadinfo.subproject_id = subproject_id;
        projectService.download_list($scope.downloadinfo).then(
            function (res) {
                $scope.dl_list = res.data;
            }
        )
    }
    //选定已设置权限的人员添加到项目中
    $scope.hide = function (index) {
        $scope.roles.length = 0;
        if (!$scope.usr_list[index]['check'][0] && !$scope.usr_list[index]['check'][1]
            && !$scope.usr_list[index]['check'][2] && !$scope.usr_list[index]['check'][3]
            && !$scope.usr_list[index]['check'][4] && !$scope.usr_list[index]['check'][5]
            && !$scope.usr_list[index]['check'][6]
        ) alert("必须指定一个角色权限！");
        else {
            $scope.usr_list[index]['show'] = false;
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
            if ($scope.usr_list[index]['check'][5] == true) {
                $scope.roles.push(6);
            }
            if ($scope.usr_list[index]['check'][6] == true) {
                $scope.roles.push(7);
            }
            $scope.rolesinfo.company_id = $cookies.get('company_id');
            $scope.rolesinfo.creator_id = $cookies.get('openid');
            $scope.rolesinfo.start_time_plan = $scope.t3.year + '-' + $scope.t3.month + '-' + $scope.t3.day;
            $scope.rolesinfo.end_time_plan = $scope.t4.year + '-' + $scope.t4.month + '-' + $scope.t4.day;
            $scope.rolesinfo.openid = $scope.usr_list[index].openid;
            $scope.rolesinfo.roleid = $scope.roles;
            projectService.add_role($scope.rolesinfo).then(
                function (res) {
                    if (res.data.success) {
                        $scope.subchose($scope.rolesinfo.subprj_id);
                    }
                }
            )
        }

    }
    $scope.peopleDetail = function (index, nickname) {
        $scope.people_detail_index = index;
        $scope.people_detail_name = nickname;
    }
    //从已分配人员中删除
    $scope.remove = function (openid) {
        console.log(openid);
        $scope.removeinfo.openid = openid;
        $scope.removeinfo.subproject_id = $scope.rolesinfo.subprj_id;
        projectService.del_project_role($scope.removeinfo).then(
            function (res) {
                console.log(res.data.success);
                if (res.data.success) {
                    $scope.subchose($scope.rolesinfo.subprj_id);
                }
            }
        )
    }
    $scope.delSubproject = function (subproject_id) {
        projectService.del_subproject(subproject_id).then(
            function (res) {
                if (!res.data.success) {
                    alert("项目进行中，无法删除！");
                }
                else {
                    $window.location.reload();
                }
            }
        )
    }
    $scope.delConf = function (conf_id) {
        projectService.del_config(conf_id).then(
            function (res) {
                console.log(res.data);
                if (!res.data.success) {
                    alert("此配置正在被使用，无法删除！");
                }
                else {
                    $window.location.reload();
                }

            }
        )
    }
    //highchars 图表
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
    //时间选择器3
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
    //时间选择器4
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
    //时间选择器5
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


    $('#containertb').highcharts({
        chart: {
            type: 'spline'
        },
        title: {
            text: '风速变化趋势图'
        },
        subtitle: {
            text: '2009年10月6日和7日两地风速情况'
        },
        xAxis: {
            type: 'datetime',
            labels: {
                overflow: 'justify'
            }
        },
        yAxis: {
            title: {
                text: '风 速 (m/s)'
            },
            min: 0,
            minorGridLineWidth: 0,
            gridLineWidth: 0,
            alternateGridColor: null,
            plotBands: [{ // Light air
                from: 0.3,
                to: 1.5,
                color: 'rgba(68, 170, 213, 0.1)',
                label: {
                    text: '轻空气',
                    style: {
                        color: '#606060'
                    }
                }
            }, { // Light breeze
                from: 1.5,
                to: 3.3,
                color: 'rgba(0, 0, 0, 0)',
                label: {
                    text: '微风',
                    style: {
                        color: '#606060'
                    }
                }
            }, { // Gentle breeze
                from: 3.3,
                to: 5.5,
                color: 'rgba(68, 170, 213, 0.1)',
                label: {
                    text: '柔和风',
                    style: {
                        color: '#606060'
                    }
                }
            }, { // Moderate breeze
                from: 5.5,
                to: 8,
                color: 'rgba(0, 0, 0, 0)',
                label: {
                    text: '温和风',
                    style: {
                        color: '#606060'
                    }
                }
            }, { // Fresh breeze
                from: 8,
                to: 11,
                color: 'rgba(68, 170, 213, 0.1)',
                label: {
                    text: '清新风',
                    style: {
                        color: '#606060'
                    }
                }
            }, { // Strong breeze
                from: 11,
                to: 14,
                color: 'rgba(0, 0, 0, 0)',
                label: {
                    text: '强风',
                    style: {
                        color: '#606060'
                    }
                }
            }, { // High wind
                from: 14,
                to: 15,
                color: 'rgba(68, 170, 213, 0.1)',
                label: {
                    text: '狂风',
                    style: {
                        color: '#606060'
                    }
                }
            }]
        },
        tooltip: {
            valueSuffix: ' m/s'
        },
        plotOptions: {
            spline: {
                lineWidth: 4,
                states: {
                    hover: {
                        lineWidth: 5
                    }
                },
                marker: {
                    enabled: false
                },
                pointInterval: 3600000, // one hour
                pointStart: Date.UTC(2009, 9, 6, 0, 0, 0)
            }
        },
        series: [{
            name: 'Hestavollane',
            data: [4.3, 5.1, 4.3, 5.2, 5.4, 4.7, 3.5, 4.1, 5.6, 7.4, 6.9, 7.1,
                7.9, 7.9, 7.5, 6.7, 7.7, 7.7, 7.4, 7.0, 7.1, 5.8, 5.9, 7.4,
                8.2, 8.5, 9.4, 8.1, 10.9, 10.4, 10.9, 12.4, 12.1, 9.5, 7.5,
                7.1, 7.5, 8.1, 6.8, 3.4, 2.1, 1.9, 2.8, 2.9, 1.3, 4.4, 4.2,
                3.0, 3.0]
        }, {
            name: 'Voll',
            data: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.3, 0.0,
                0.0, 0.4, 0.0, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
                0.0, 0.6, 1.2, 1.7, 0.7, 2.9, 4.1, 2.6, 3.7, 3.9, 1.7, 2.3,
                3.0, 3.3, 4.8, 5.0, 4.8, 5.0, 3.2, 2.0, 0.9, 0.4, 0.3, 0.5, 0.4]
        }],
        navigation: {
            menuItemStyle: {
                fontSize: '10px'
            }
        }
    });

})
